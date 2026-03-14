import { apiClient } from "@/api/axiosClient";
const ORGANIZATION_API_BASE = "/orgs";

export const getOrganizationsAPI = async () => {
  return apiClient.get(`${ORGANIZATION_API_BASE}/my`);
};

