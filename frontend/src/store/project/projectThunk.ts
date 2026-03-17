import { createAsyncThunk } from '@reduxjs/toolkit';
import { setProjects, setCurrentProject, setLoading, setProjectMembers } from './projectSlice';
import { addProjectMemberAPI, createProjectAPI, getProjectDetailsAPI, getProjectMembersAPI, getProjectsAPI } from '../../../service/project.service';

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const projects = await getProjectsAPI();
      dispatch(setProjects(projects.data));
      console.log('Fetched projects:', projects.data);
      return projects.data;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (data: { name: string; description?: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const project = await createProjectAPI(data);
      return project;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'project/fetchProjectDetails',
  async (projectSlug: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const project = await getProjectDetailsAPI(projectSlug);
      dispatch(setCurrentProject(project));
      return project;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchProjectMembers = createAsyncThunk(
  'project/fetchProjectMembers',
  async (projectSlug: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const members = await getProjectMembersAPI(projectSlug);
      dispatch(setProjectMembers(members.data));
      return members.data.members;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const addProjectMember = createAsyncThunk(
  'project/addProjectMember',
  async ({ projectSlug, email, role }: { projectSlug: string; email: string; role: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await addProjectMemberAPI(projectSlug, { email, role });
      return response.data;
    } finally {
      dispatch(setLoading(false));
    }
  }
);