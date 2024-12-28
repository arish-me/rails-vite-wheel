import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserDetailsQuery, useGetOrganizationDetailsQuery } from "@/app/services/auth/authService";
import { setOrganization } from "@/features/organization/organizationSlice";
import { RootState } from "@/store";

export function AppInitializer() {
  const dispatch = useDispatch();
  const { data: userDetails } = useGetUserDetailsQuery();
  const { data: organizationDetails } = useGetOrganizationDetailsQuery();

  useEffect(() => {
    if (organizationDetails) {
      dispatch(setOrganization(organizationDetails));
    }
  }, [organizationDetails, dispatch]);

  return null; // This is just a state initializer, no UI required
}
