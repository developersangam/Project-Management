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


export const getOrgSlugAPI = async (data: {
  name: string;
}) => {
  return apiClient.post(`${ORGANIZATION_API_BASE}/getOrgSlug`, data);
};

export const addMemberToOrganizationAPI = async (data: {
  orgSlug: string;
  email: string;
  role: string;
}) => {
  return apiClient.post(`${ORGANIZATION_API_BASE}/${data.orgSlug}/invites`, {
    email: data.email,
    role: data.role,
  });
};

export const acceptInvitationToOrganizationAPI = async (data: {
  token: string;
}) => {
  return apiClient.post(`${ORGANIZATION_API_BASE}/accept`, data);
};

export const getOrganizationDetailsAPI = async (orgSlug: string) => {
  return apiClient.get(`${ORGANIZATION_API_BASE}/${orgSlug}`);
};

export const getOrganizationMembersAPI = async (orgSlug: string) => {
  return apiClient.get(`${ORGANIZATION_API_BASE}/${orgSlug}/members`);
};

export const removeOrganizationMembersAPI = async (data: {
  orgSlug: string;
  userId: string;
}) => {
  return apiClient.delete(
    `${ORGANIZATION_API_BASE}/${data.orgSlug}/members/${data.userId}`,
  );
};

export const changeMemberRoleOfOrganizationAPI = async (data: any) => {
  return apiClient.patch(
    `${ORGANIZATION_API_BASE}/${data.orgSlug}/members/${data.userId}/role`,
    { role: data.role },
  );
};

export const updateOrganizationMemberRoleAPI = async (
  orgSlug: string,
  memberId: number,
  role: string,
) => {
  return apiClient.put(
    `${ORGANIZATION_API_BASE}/${orgSlug}/members/${memberId}`,
    { role },
  );
};

export const deleteOrganizationAPI = async (orgSlug: string) => {
  return apiClient.delete(`${ORGANIZATION_API_BASE}/${orgSlug}`);
};

export const updateOrganizationAPI = async (
  orgSlug: string,
  data: { name?: string; description?: string },
) => {
  return apiClient.patch(`${ORGANIZATION_API_BASE}/${orgSlug}`, data);
};
