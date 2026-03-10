import { createAsyncThunk } from '@reduxjs/toolkit';
import { setOrganizations, setCurrentOrganization, setLoading } from './organizationSlice';
import { Organization } from '../../types';

const getOrganizationsAPI = async (): Promise<Organization[]> => {
  // Placeholder
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: '1', name: 'Org 1', slug: 'org1', members: [] },
    { id: '2', name: 'Org 2', slug: 'org2', members: [] },
  ];
};

export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const organizations = await getOrganizationsAPI();
      dispatch(setOrganizations(organizations));
      if (organizations.length > 0 && !organizations.find(o => o.id === organizations[0].id)) {
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