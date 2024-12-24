import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import store from "@/app/store";

const backendURL = process.env.APP_URL

const getSubDomain = () => {
  const hostname = window.location.hostname; // e.g., "galaxy.localhost"
  const parts = hostname.split(".");

  if (parts.length >= 2) {
    const subdomain = parts[0]; // Extract the subdomain
    return domain_url(subdomain);
  }

  return process.env.APP_URL || "http://localhost:3000"; // Default backend URL
};

const domain_url = (subdomain) => {
  const APP_DOMAIN = process.env.APP_DOMAIN; // Ensure this environment variable is defined
  const isDevelopment = process.env.NODE_ENV === "development";

  return isDevelopment
    ? `http://${subdomain}.${APP_DOMAIN}`
    : `https://${subdomain}.${APP_DOMAIN}`;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getSubDomain(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the token to every request if it exists
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const staticHeaders = 'arish'
    const state = store.getState(); // Get the current Redux state
    const token = state.auth?.userToken; // Access the token from Redux auth slice
    config.headers["X-Galaxy-Header"] = "arish";

    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Handle global responses
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response; // Pass through successful responses
//   },
//   (error) => {
//     if (error.response?.status === 403) {
//       // window.location.href = "/not-authorized";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
