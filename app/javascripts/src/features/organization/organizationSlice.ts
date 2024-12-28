import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of organization state
interface OrganizationState {
  id: number | null;
  name: string;
  subdomain: string;
  phone_number: string;
  image_url: string;
}

const initialState: OrganizationState = {
  id: null,
  name: "",
  subdomain: "",
  phone_number: "",
  image_url: null
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization(state, action: PayloadAction<OrganizationState>) {
      return action.payload;
    },
    updateOrganization(state, action: PayloadAction<Partial<OrganizationState>>) {
      return { ...state, ...action.payload };
    },
    clearOrganization() {
      return initialState;
    },
  },
});

// Export actions
export const { setOrganization, updateOrganization, clearOrganization } = organizationSlice.actions;

// Export reducer
export default organizationSlice.reducer;
