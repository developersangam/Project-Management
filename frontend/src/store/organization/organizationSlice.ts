import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationState, Organization } from '../../types';

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  loading: false,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    setCurrentOrganization: (state, action: PayloadAction<Organization | null>) => {
      state.currentOrganization = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrganizations, setCurrentOrganization, setLoading } = organizationSlice.actions;
export default organizationSlice.reducer;