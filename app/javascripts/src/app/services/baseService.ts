import { fetchBaseQuery, FetchArgs, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { updateToken, logout } from "@/features/auth/authSlice";
import { RootState } from "@/store"; // Adjust the import path as necessary

// Utility function to determine the base URL dynamically
const getSubDomain = () => {
  const hostname = window.location.hostname; // e.g., "galaxy.localhost"
  const parts = hostname.split(".");

  if (parts.length >= 2) {
    const subdomain = parts[0]; // Extract the subdomain
    return domain_url(subdomain);
  }

  return process.env.VITE_SERVER_URL || "http://localhost:3000"; // Default backend URL
};


const domain_url = (subdomain) => {
  const APP_DOMAIN = process.env.APP_DOMAIN; // Ensure this environment variable is defined
  const isDevelopment = process.env.NODE_ENV === "development";

  return isDevelopment
    ? `http://${subdomain}.${APP_DOMAIN}`
    : `https://${subdomain}.${APP_DOMAIN}`;
};


// Define the base query with dynamic baseUrl
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, { status: number; message?: string }> = fetchBaseQuery({
  baseUrl: getSubDomain(), // Dynamically determine baseUrl

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    if (token) {
      headers.set("authorization", `${token}`);
      headers.set("X-Galaxy-Header", "arish");
    }
    return headers;
  },
});

// Enhance baseQuery with re-authentication logic
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, { status: number; message?: string }> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  // Handle token expiration or invalid token
  if (result.error && (result.error.status === 401 || result.error.status === "FETCH_ERROR")) {
    // Optionally, handle token refresh here or logout the user
    api.dispatch(logout());
  } else if (result.data && result.meta?.response?.headers) {
    // If a new token is provided in the headers, update it in the state
    const newToken = result.meta.response.headers
      .get("authorization")
      ?.split(" ")[1];
    if (newToken) {
      api.dispatch(updateToken(`Bearer ${newToken}`));
    }
  }

  return result;
};
