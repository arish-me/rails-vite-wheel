// authService.ts
import { baseQueryWithReauth } from "../baseService";
import { createApi, FetchArgs, BaseQueryFn } from "@reduxjs/toolkit/query/react";

// Define a type for the user details response
interface UserDetails {
  id: number;
  name: string;
  email: string;
  // Add other relevant fields as per your API response
}

interface OrganizationDetails {
  id: number;
  name: string;
  subdomain: string;
  phone_number: string;
}

// Create a type for the query function
type QueryFn = BaseQueryFn<string | FetchArgs, unknown, unknown>;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth as QueryFn,
  endpoints: (build) => ({
    getUserDetails: build.query<UserDetails, void>({
      query: () => ({
        url: "api/v1/users",
        method: "GET",
      }),
    }),
    getOrganizationDetails: build.query<OrganizationDetails, void>({
      query: () => ({
        url: "api/v1/accounts",
        method: "GET",
      }),
    }),
  }),
});

// Export the generated hook
export const { useGetUserDetailsQuery, useGetOrganizationDetailsQuery } = authApi;

