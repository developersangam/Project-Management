import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import organizationReducer from './organization/organizationSlice';
import projectReducer from './project/projectSlice';
import taskReducer from './task/taskSlice';
import uiReducer from './ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    project: projectReducer,
    task: taskReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;