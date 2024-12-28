import { configureStore, Middleware } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "./services/auth/authService";
import organizationReducer from "@/features/organization/organizationSlice";
import authMiddleware from "@/middleware/authMiddleware";
import permissionsReducer from "@/features/permissions/permissionsSlice";

// Define the type of the store's state
export type RootState = ReturnType<typeof store.getState>;

// Define the type of the dispatch function
export type AppDispatch = typeof store.dispatch;

// Create the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    permissions: permissionsReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for better performance
    }).concat(authApi.middleware, authMiddleware as Middleware),
});

// Export the store
export default store;