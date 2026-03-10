import { createAsyncThunk } from '@reduxjs/toolkit';
import { setProjects, setCurrentProject, addProject, setLoading } from './projectSlice';
import { Project } from '../../types';

const getProjectsAPI = async (organizationId: string): Promise<Project[]> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', name: 'Project 1', slug: 'project-1', description: 'Desc', organizationId, createdAt: '', updatedAt: '' },
  ];
};

const createProjectAPI = async (data: { name: string; description?: string; organizationId: string }): Promise<Project> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: Date.now().toString(),
    name: data.name,
    slug: data.name.toLowerCase().replace(/\s+/g, '-'),
    description: data.description,
    organizationId: data.organizationId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const getProjectAPI = async (projectId: string): Promise<Project> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: projectId,
    name: 'Project Details',
    slug: 'project-details',
    description: 'Details',
    organizationId: '1',
    createdAt: '',
    updatedAt: '',
  };
};

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (organizationId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const projects = await getProjectsAPI(organizationId);
      dispatch(setProjects(projects));
      return projects;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (data: { name: string; description?: string; organizationId: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const project = await createProjectAPI(data);
      dispatch(addProject(project));
      return project;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'project/fetchProjectDetails',
  async (projectId: string, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const project = await getProjectAPI(projectId);
      dispatch(setCurrentProject(project));
      return project;
    } finally {
      dispatch(setLoading(false));
    }
  }
);