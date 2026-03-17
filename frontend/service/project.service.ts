import { apiClient } from "@/api/axiosClient";
import { store } from "@/store";

let currentOrganization;
const PROJECT_API_BASE = `/orgs`;

export const getProjectsAPI = async () => {
    const state = store.getState()
    
    currentOrganization = state.organization.currentOrganization;
  return apiClient.get(`${PROJECT_API_BASE}/${currentOrganization?.organization?.slug}/projects`);
};

export const createProjectAPI = async (data: {
  name: string;
  description?: string;
}) => {
    const state = store.getState()
    currentOrganization = state.organization.currentOrganization;
  return apiClient.post(`${PROJECT_API_BASE}/${currentOrganization?.organization?.slug}/projects`, data);
};

export const getProjectDetailsAPI = async (projectSlug: string) => {
    const state = store.getState()
    
    currentOrganization = state.organization.currentOrganization;
  return apiClient.get(`${PROJECT_API_BASE}/${currentOrganization?.organization?.slug}/projects/${projectSlug}`);
}

export const getProjectMembersAPI = async (projectSlug: string) => {
    const state = store.getState()
    currentOrganization = state.organization.currentOrganization;
  return apiClient.get(`${PROJECT_API_BASE}/${currentOrganization?.organization?.slug}/projects/${projectSlug}/members`);
}

export const addProjectMemberAPI = async (projectSlug: string, data: { email: string; role: string }) => {
    const state = store.getState()
    currentOrganization = state.organization.currentOrganization;
  return apiClient.post(`${PROJECT_API_BASE}/${currentOrganization?.organization?.slug}/projects/${projectSlug}/members`, data);
}

