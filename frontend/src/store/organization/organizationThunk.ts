import { createAsyncThunk } from '@reduxjs/toolkit';
import { setOrganizations, setCurrentOrganization, setLoading } from './organizationSlice';
import { Organization } from '../../types';
import { getOrganizationsAPI } from '../../../service/organization.service';
import { RootState } from "../../store";


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
      const currentOrganization = state.organization.currentOrganization;

      if (
        organizations.length > 0 &&
        (!currentOrganization ||
          !organizations.some((o) => o.id === currentOrganization.id))
      ) {
        dispatch(setCurrentOrganization(organizations[0]));
      }

      return organizations;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const switchOrganization = createAsyncThunk(
  'organization/switchOrganization',
  async (organizationId: string, { dispatch, getState }) => {
    const state = getState() as any;
    const org = state.organization.organizations.find((o: Organization) => o.id === organizationId);
    if (org) {
      dispatch(setCurrentOrganization(org));
    }
  }
);