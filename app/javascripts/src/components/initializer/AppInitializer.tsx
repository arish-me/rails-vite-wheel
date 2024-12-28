import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDetailsQuery, useGetOrganizationDetailsQuery, useGetPermissionsQuery } from "@/app/services/auth/authService";
import { logout, setCredentials } from '@/features/auth/authSlice'
import { setOrganization } from "@/features/organization/organizationSlice";
import { setPermissions } from "@/features/permissions/permissionsSlice";
import { RootState } from "@/store";

export function AppInitializer() {
  const dispatch = useDispatch();
  const { data: userDetails } = useGetUserDetailsQuery();
  const { data: organizationDetails } = useGetOrganizationDetailsQuery();
  const { data: permissions } = useGetPermissionsQuery();
  useEffect(() => {
    if (userDetails) {
      dispatch(setCredentials(userDetails));
    }
  }, [userDetails, dispatch]);

  useEffect(() => {
    if (organizationDetails) {
      dispatch(setOrganization(organizationDetails));
    }
  }, [organizationDetails, dispatch]);

  useEffect(() => {
    if (permissions) {
      dispatch(setPermissions(permissions));
    }
  }, [permissions, dispatch]);

  return null; // This is just a state initializer, no UI required
}
