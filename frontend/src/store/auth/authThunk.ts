import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUser, setToken, setLoading, logout } from './authSlice';
import { User } from '../../types';

// Placeholder API functions
const loginAPI = async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock response
  return {
    user: { id: '1', email: credentials.email, name: 'John Doe' },
    token: 'mock-jwt-token',
  };
};

const registerAPI = async (data: { email: string; password: string; name: string }): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    user: { id: '1', email: data.email, name: data.name },
    token: 'mock-jwt-token',
  };
};

const logoutAPI = async (): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
};

const updateUserProfileAPI = async (userData: Partial<User>): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: '1',
    email: userData.email || 'user@example.com',
    name: userData.name || 'Updated User',
    avatar: userData.avatar,
  };
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await loginAPI(credentials);
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));
      return response;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await registerAPI(data);
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));
      return response;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await logoutAPI();
    dispatch(logout());
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData: Partial<User>, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const updatedUser = await updateUserProfileAPI(userData);
      dispatch(setUser(updatedUser));
      return updatedUser;
    } finally {
      dispatch(setLoading(false));
    }
  }
);