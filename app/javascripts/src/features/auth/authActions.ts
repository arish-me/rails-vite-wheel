import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Define the backend URL based on the environment

const getSubDomain = () => {
  const hostname = window.location.hostname; // e.g., "galaxy.localhost"
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    const subdomain = parts[0];
    return `http://${subdomain}.localhost:3000`; // Adjust your backend domain
  }
  return process.env.VITE_SERVER_URL || "http://localhost:3000"; // Default backend URL
};

const backendURL = getSubDomain();

// Define the types for the login and registration payloads
interface LoginPayload {
  email: string;
  password?: string;
  otp_code?: string;
}

interface SocialLoginPayload {
  provider: string;
  token?: string;
}

// Define the response type for the login and register actions
interface AuthResponse {
  data: any; // Adjust based on your API response structure
  userToken?: string;
  isLoggedIn?: boolean;
}

// Utility function to get default headers
const getHeaders = (authToken?: string) => {
  return {
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "application/json",
    "X-Galaxy-Header": "arish",
    ...(authToken && { Authorization: authToken }),
  };
};

// Utility function to handle errors
const handleError = (error: any, rejectWithValue: any) => {
  if (error.response && error.response.data) {
    return rejectWithValue(error.response.data);
  } else {
    return rejectWithValue(error.message);
  }
};

// Login action
export const userLogin = createAsyncThunk<AuthResponse, LoginPayload>(
  "auth/login",
  async ({ email }, { rejectWithValue }) => {
    try {
      const config = {
        headers: getHeaders(),
      };
      const response = await axios.post(
        `${backendURL}/login`,
        { user: { email } },
        config
      );

      return {
        data: response.data,
      };
    } catch (error: any) {
      return handleError(error, rejectWithValue);
    }
  }
);


// Login action
export const socialLogin = createAsyncThunk<AuthResponse, SocialLoginPayload>(
  "auth/social_login",
  async ({provider, token}, { rejectWithValue }) => {
    try {
      const config = {
        headers: getHeaders(),
      };

      const response = await axios.post(
        `${backendURL}api/v1/auth/google`,
        { provider: provider, token: token },
        config
      );


      const authToken = response.headers["authorization"];
      if (authToken) {
        localStorage.setItem("userToken", authToken);
      }

      return {
        data: response.data.data,
        userToken: authToken,
        isLoggedIn: response.data.isLoggedIn,
      };
    } catch (error: any) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Verify OTP action
export const verifyOTP = createAsyncThunk<AuthResponse, LoginPayload>(
  "auth/verifyOTP",
  async ({ otp_code, email }, { rejectWithValue }) => {
    try {
      const config = {
        headers: getHeaders(),
      };

      const response = await axios.post(
        `${backendURL}/verify_otp`,
        { user: { otp_code, email } },
        config
      );

      const authToken = response.headers["authorization"];
      if (authToken) {
        localStorage.setItem("userToken", authToken);
      }

      return {
        data: response.data.data,
        userToken: authToken,
        isLoggedIn: response.data.isLoggedIn,
      };
    } catch (error: any) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Logout action
export const userLogout = createAsyncThunk<void, void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem("userToken");
      const config = {
        headers: getHeaders(authToken || undefined),
      };

      await axios.delete(`${backendURL}/logout`, config);
      localStorage.removeItem("userToken");
    } catch (error: any) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Destroy user action
export const destroyUser = createAsyncThunk<void, void>(
  "auth/destroyUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("userToken");
    } catch (error: any) {
      return handleError(error, rejectWithValue);
    }
  }
);
