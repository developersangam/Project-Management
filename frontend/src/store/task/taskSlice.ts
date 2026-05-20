import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState, Task } from '../../types';

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  columns: [],
  loading: false,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {

    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setColumns: (state, action: PayloadAction<any[]>) => {
      state.columns = action.payload;
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      console.log("Updating task in reducer:", action.payload);
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.currentTask && state.currentTask._id === action.payload._id) {
        state.currentTask = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      if (state.currentTask && state.currentTask.id === action.payload) {
        state.currentTask = null;
      }
    },
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTasks, setColumns, updateTask, deleteTask, setCurrentTask, setLoading } = taskSlice.actions;
export default taskSlice.reducer;