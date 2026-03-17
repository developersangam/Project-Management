import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setOrganizations,
  setCurrentOrganization,
  setLoading,
} from "./organizationSlice";
import { Organization } from "../../types";
import {
  addMemberToOrganizationAPI,
  createOrganizationAPI,
  getOrganizationsAPI,
} from "../../../service/organization.service";
import { RootState } from "../../store";
import { toast } from "sonner";

export const fetchOrganizations = createAsyncThunk(
  "organization/fetchOrganizations",
  async (_, { dispatch, getState }) => {
    dispatch(setLoading(true));
    try {
      const response = await getOrganizationsAPI();
      const organizations: Organization[] = response.data.data;
      dispatch(setOrganizations(organizations));
      // get current organization from store
      const state: RootState = getState() as RootState;
      let currentOrganization = state.organization.currentOrganization;
      if (currentOrganization) {
        console.log("Current organization before update:", currentOrganization);
        currentOrganization =
          organizations.find(
            (o) =>
              o?.organization?.id === currentOrganization?.organization?.id,
          ) || null;
        dispatch(setCurrentOrganization(currentOrganization));
      }
      if (
        organizations.length > 0 &&
        (!currentOrganization ||
          !organizations.some(
            (o) =>
              o?.organization?.id === currentOrganization?.organization?.id,
          ))
      ) {
        dispatch(setCurrentOrganization(organizations[0]));
      }
      return organizations;
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const createOrganization = createAsyncThunk(
  "organization/createOrganization",
  async (data: { name: string; description?: string }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await createOrganizationAPI(data);
      const newOrganization: Organization = response.data;
      dispatch(fetchOrganizations());
      dispatch(setCurrentOrganization(newOrganization));
      return newOrganization;
    } catch (error) {
      dispatch(setLoading(false));
      // throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const switchOrganization = createAsyncThunk(
  "organization/switchOrganization",
  async (org: Organization, { dispatch, getState }) => {
    try {
      if (org) {
        dispatch(setCurrentOrganization(org));
      }
    } catch (error) {
      console.error("Failed to switch organization:", error);
    }
  },
);

export const addMemberToOrganization = createAsyncThunk(
  "organization/addMemberToOrganization",
  async (
    data: { orgSlug: string; email: string; role: string },
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await addMemberToOrganizationAPI(data);
      // After adding member, refetch organizations to update the list
      dispatch(fetchOrganizations());
      toast.success(response.data.message || "Member added successfully");
      return response.data;
    } catch (error: any) {
      console.log("Error response from API:", error);
      toast.error(error?.response?.data?.message || "Failed to add member");
      console.error("Failed to add member to organization:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  },
);
