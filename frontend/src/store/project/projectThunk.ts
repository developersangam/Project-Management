import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setProjects,
  setCurrentProject,
  setLoading,
  setProjectMembers,
} from "./projectSlice";
import {
  addProjectMemberAPI,
  changeProjectMemberRoleAPI,
  createProjectAPI,
  getProjectDetailsAPI,
  getProjectMembersAPI,
  getProjectsAPI,
  removeProjectMemberAPI,
} from "../../service/project.service";
import { toast } from "sonner";

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const projects = await getProjectsAPI();
      dispatch(setProjects(projects.data));
      return projects.data;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (data: { name: string; description?: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const project = await createProjectAPI(data);
      return project;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const fetchProjectDetails = createAsyncThunk(
  "project/fetchProjectDetails",
  async (projectSlug: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const project = await getProjectDetailsAPI(projectSlug);
      console.log(project.data)
      dispatch(setCurrentProject(project.data));
      return project;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const fetchProjectMembers = createAsyncThunk(
  "project/fetchProjectMembers",
  async (projectSlug: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const members = await getProjectMembersAPI(projectSlug);
      dispatch(setProjectMembers(members.data));
      return members.data.members;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const addProjectMember = createAsyncThunk(
  "project/addProjectMember",
  async (
    {
      projectSlug,
      email,
      role,
    }: { projectSlug: string; email: string; role: string },
    { dispatch },
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await addProjectMemberAPI(projectSlug, { email, role });
      toast.success(
        response.message ||
          response.data.message ||
          "Member added successfully",
      );
      return response.data;
    } catch (error: any) {
      console.log("HERE");
      toast.error(error?.response?.data?.message || "Failed to add member");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const removeProjectMember = createAsyncThunk(
  "project/removeProjectMember",
  async (
    { projectSlug, userId }: { projectSlug: string; userId: string },
    { dispatch },
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await removeProjectMemberAPI({ projectSlug, userId });
      toast.success(
        response.message ||
          response.data.message ||
          "Member removed successfully",
      );
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove member");
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const changeProjectMemberRole = createAsyncThunk(
  "project/changeProjectMemberRole",
  async (
    {
      projectSlug,
      userId,
      data,
    }: { projectSlug: string; userId: string; data: { role: string } },
    { dispatch },
  ) => {
    dispatch(setLoading(true));
    try {
      const response = await changeProjectMemberRoleAPI({
        projectSlug,
        userId,
        data,
      });
      toast.success(response.message || "Role changed successfully");
      return response.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change member role",
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);
