import { apiClient } from "@/api/axiosClient";
import { store } from "@/store";
import { Task } from "@/types";

let currentOrganization;
const TASK_API_BASE = `/orgs`;

export const getAllColumnsAPI = async (projectSlug: string) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.get(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${projectSlug}/columns`,
  );
};

export const getTasksAPI = async (params: {
  projectSlug: string;
  view: string;
  limit: number;
}) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.get(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${params.projectSlug}/tasks`,
    { params: { view: params.view, limit: params.limit } },
  );
};

export const updateTaskAPI = async (data: Partial<Task>) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.post(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${data.projectSlug}/tasks`,
    {},
  );
};


export const createTaskAPI = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.post(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${data.projectSlug}/tasks`,
    data,
  );
}

export const moveTaskAPI = async (params: {
  projectSlug: string;
  taskId: string;
  columnId: string;
}) => {
  const state = store.getState();

  currentOrganization = state.organization.currentOrganization;
  return apiClient.patch(
    `${TASK_API_BASE}/${currentOrganization?.organization?.slug}/projects/${params.projectSlug}/tasks/${params.taskId}/move`,
    { columnId: params.columnId },
  );
};
