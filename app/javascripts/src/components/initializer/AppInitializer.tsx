import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDetailsQuery, useGetOrganizationDetailsQuery, useGetPermissionsQuery } from "@/app/services/auth/authService";
import { logout, setCredentials } from '@/features/auth/authSlice'
import { setOrganization } from "@/features/organization/organizationSlice";
import { setPermissions } from "@/features/permissions/permissionsSlice";
import { RootState } from "@/store";


export function AppInitializer() {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data: userDetails } = useGetUserDetailsQuery(undefined, {
    skip: !isLoggedIn,
  });

  const { data: organizationDetails, refetch: refetchOrganizationDetails } = useGetOrganizationDetailsQuery(undefined, {
    skip: !isLoggedIn,
  });

  const { data: permissions } = useGetPermissionsQuery(undefined, {
    skip: !isLoggedIn,
  });

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

  return null;
}
