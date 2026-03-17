import { apiClient } from "@/api/axiosClient";
const ORGANIZATION_API_BASE = "/orgs";

export const getOrganizationsAPI = async () => {
  return apiClient.get(`${ORGANIZATION_API_BASE}/my`);
};

export const createOrganizationAPI = async (data: {
  name: string;
  description?: string;
}) => {
    return apiClient.post(`${ORGANIZATION_API_BASE}/`, data);
};

export const addMemberToOrganizationAPI = async (data: { orgSlug: string; email: string; role: string }) => {
  return apiClient.post(`${ORGANIZATION_API_BASE}/${data.orgSlug}/invites`, {
    email: data.email,
    role: data.role
  });
};