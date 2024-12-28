 

import axiosInstance from "./axios";

// Define individual functions
export const fetch = async (): Promise<any> => {
  return await axiosInstance.get("/api/v1/organization_settings");
};

export const create = async (payload: any): Promise<any> => {
  return await axiosInstance.post("/api/v1/organization_settings", payload);
};

export const update = async (id: string | number, payload: any): Promise<any> => {
  return await axiosInstance.put(`/api/v1/organization_settings/${id}`, payload);
};

const organizationApi = {
  fetch,
  create,
  update,
};

export default organizationApi;
