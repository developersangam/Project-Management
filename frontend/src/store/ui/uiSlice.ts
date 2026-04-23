import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Task } from '../../types';

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  isMobile: false,
  taskDrawerOpen: false,
  selectedTask: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    openTaskDrawer: (state, action: PayloadAction<Task>) => {
      state.taskDrawerOpen = true;
      state.selectedTask = action.payload;
    },
    closeTaskDrawer: (state) => {
      state.taskDrawerOpen = false;
      state.selectedTask = null;
    },
  },
});

export const { toggleSidebar, setTheme, toggleTheme, openTaskDrawer, closeTaskDrawer } = uiSlice.actions;
export default uiSlice.reducer;