import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState, Project } from '../../types';
import { set } from 'date-fns';
interface Meta {
  total?: number;
  page: number;
  limit: number;
}

interface ProjectsResponse {
  data: Project[];
  meta: Meta;
}

const initialState: ProjectState = {
  projects: {
    data: [],
    meta: {
      total: 0,
      page: 0,
      limit: 0,
    }
  },
  projectMembers: [],
  currentProject: null,
  loading: false,

};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectsResponse>) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.data.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProjectMembers: (state, action: PayloadAction<any[]>) => {
      state.projectMembers = action.payload;
    },
  },
});

export const { setProjects, setCurrentProject, addProject, setLoading, setProjectMembers } = projectSlice.actions;
export default projectSlice.reducer;