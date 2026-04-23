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
  whitelist: ["user", "token", "isAuthenticated"], // Only persist user and token
};

const organizationPersistConfig = {
  key: "organization",
  storage,
  whitelist: ["currentOrganization"], // Only persist currentOrganization
};

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["theme"], // Only persist theme
};

const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  organization: persistReducer(organizationPersistConfig, organizationReducer),
  project: projectReducer,
  task: taskReducer,
  ui: persistReducer(uiPersistConfig, uiReducer),
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined; // 🔥 clears ALL redux state
  }

  return appReducer(state, action);
};

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
