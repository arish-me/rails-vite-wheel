

import axiosInstance from "./axios";

// Define individual functions
export const fetch = async (): Promise<any> => {
  return await axiosInstance.get("/api/v1/accounts");
};

export const create = async (payload: any): Promise<any> => {
  return await axiosInstance.post("/api/v1/accounts", payload);
};

export const update = async (id: string | number, payload: any): Promise<any> => {
  return await axiosInstance.put(`/api/v1/accounts/${id}`, payload);
};

export const upload = async (id: string | number, payload: FormData): Promise<any> => {
  return await axiosInstance.post(`/api/v1/accounts/${id}/upload_image`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// Optionally export everything as a named object for grouped imports
const accountApi = {
  fetch,
  create,
  update,
  upload
};

export default accountApi;
