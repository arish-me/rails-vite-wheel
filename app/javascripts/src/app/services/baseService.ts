import { fetchBaseQuery, FetchArgs, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { updateToken, logout } from "@/features/auth/authSlice";
import { RootState } from "@/store"; // Adjust the import path as necessary

// Utility function to determine the base URL dynamically
const getSubDomain = () => {
  const hostname = window.location.hostname; // e.g., "galaxy.localhost"
  const parts = hostname.split(".");

  if (parts.length >= 2) {
    const subdomain = parts[0]; // Extract the subdomain
    return `http://${subdomain}.localhost:3000`; // Adjust your backend domain
  }

  return process.env.VITE_SERVER_URL || "http://localhost:3000"; // Default backend URL
};

// Define the base query with dynamic baseUrl
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, { status: number; message?: string }> = fetchBaseQuery({
  baseUrl: getSubDomain(), // Dynamically determine baseUrl

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userToken; // Ensure you replace `RootState` with the correct type
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
  if (result.error && result.error.status === 401) {
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
