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

export const getOrganizationDetailsAPI = async (orgSlug: string) => {
  return apiClient.get(`${ORGANIZATION_API_BASE}/${orgSlug}`);
}

export const getOrganizationMembersAPI = async (orgSlug: string) => {
  return apiClient.get(`${ORGANIZATION_API_BASE}/${orgSlug}/members`);
}

export const removeOrganizationMemberAPI = async (orgSlug: string, memberId: number) => {
  return apiClient.delete(`${ORGANIZATION_API_BASE}/${orgSlug}/members/${memberId}`);
}

export const updateOrganizationMemberRoleAPI = async (orgSlug: string, memberId: number, role: string) => {
  return apiClient.put(`${ORGANIZATION_API_BASE}/${orgSlug}/members/${memberId}`, { role });
}

export const deleteOrganizationAPI = async (orgSlug: string) => {
  return apiClient.delete(`${ORGANIZATION_API_BASE}/${orgSlug}`);
}

export const updateOrganizationAPI = async (orgSlug: string, data: { name?: string; description?: string }) => {
  return apiClient.put(`${ORGANIZATION_API_BASE}/${orgSlug}`, data);
}