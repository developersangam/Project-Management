import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState, Task } from '../../types';

const initialState: UiState = {
  sidebarOpen: true,
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

export const { toggleSidebar, openTaskDrawer, closeTaskDrawer } = uiSlice.actions;
export default uiSlice.reducer;