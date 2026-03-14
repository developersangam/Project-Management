import axios from "axios";
import { store } from "@/store";
import { logout } from "@/store/auth/authSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      store.dispatch(logout());

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message = error.response?.data?.message || "Something went wrong";

    return Promise.reject(message);
  },
);

export default axiosInstance;
