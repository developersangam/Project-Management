import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser, setToken, setLoading, logout } from "./authSlice";
import { User } from "../../types";
import {
  getUserProfileAPI,
  loginAPI,
  registerAPI,
} from "../../service/user.service";
import { persistor } from "../index";
import { toast } from "sonner";

const updateUserProfileAPI = async (userData: Partial<User>): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id: "1",
    email: userData.email || "user@example.com",
    name: userData.name || "Updated User",
    avatar: userData.avatar,
  };
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await loginAPI(credentials);
      toast.success(response.data.message || "Login successful!");
      dispatch(setToken(response.data.token));
      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: Partial<User>, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response: any = await registerAPI(data);
      toast.success(response?.data.message || "Registration successfully done");
      return response;
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      dispatch(logout());
      await persistor.purge();
    } catch (error) {
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData: Partial<User>, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const updatedUser = await updateUserProfileAPI(userData);
      dispatch(setUser(updatedUser));
      return updatedUser;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { dispatch }) => {
    // Simulate fetching user profile
    dispatch(setLoading(true));
    try {
      const response = await getUserProfileAPI();
      const userProfile = response.data;
      dispatch(setUser(userProfile));
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      dispatch(setLoading(false));
    }
  },
);
