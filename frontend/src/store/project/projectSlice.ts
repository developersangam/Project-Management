import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState, Project } from '../../types';

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProjects, setCurrentProject, addProject, setLoading } = projectSlice.actions;
export default projectSlice.reducer;