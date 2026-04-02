import { apiClient } from "@/api/axiosClient";
import { User } from "@/types";
const USER_API_BASE = "/users";
export const loginAPI = async (data: {
  email: string;
  password: string;
}) => {
  return apiClient.post(`${USER_API_BASE}/login`, data);
};

export const registerAPI = async (data: Partial<User>): Promise<{ user: User; token: string }> => {
  return apiClient.post(`${USER_API_BASE}/register`, data);
};

export const logoutAPI = async (data:any): Promise<void> => {
  return apiClient.post(`${USER_API_BASE}/logout`, data);
};

export const updateUserProfileAPI = async (
  userData: Partial<User>
): Promise<User> => {
  return apiClient.put(`${USER_API_BASE}/profile`, userData);
};

export const getUserProfileAPI = async (): Promise<User> => {
  return apiClient.get(`${USER_API_BASE}/me`); 
};