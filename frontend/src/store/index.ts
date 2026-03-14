import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import organizationReducer from "./organization/organizationSlice";
import projectReducer from "./project/projectSlice";
import taskReducer from "./task/taskSlice";
import uiReducer from "./ui/uiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "@reduxjs/toolkit";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token","isAuthenticated"], // Only persist user and token
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  organization: organizationReducer,
  project: projectReducer,
  task: taskReducer,
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools:
    process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
