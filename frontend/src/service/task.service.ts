import { apiClient } from "@/api/axiosClient";
import { store } from "@/store";

let currentOrganization;
const TASK_API_BASE = `/orgs`;

export const getAllColumnsAPI = async (projectSlug: string) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.get(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${projectSlug}/columns`,
  );
};


export const getTasksAPI = async (params: { projectSlug: string; view: string; limit: number }) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.get(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${params.projectSlug}/tasks`,
    { params: { view: params.view, limit: params.limit } }
  );
};

