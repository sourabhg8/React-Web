import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organizations: [],
  selectedOrganization: null,
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    hasMore: false,
  },
  isLoading: false,
  error: null,
  // Modal states
  isFormModalOpen: false,
  isDeleteModalOpen: false,
  formMode: 'create', // 'create' | 'edit'
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    // Fetch organizations
    fetchOrganizationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrganizationsSuccess: (state, action) => {
      const { items, totalCount, page, pageSize, hasMore } = action.payload;
      state.organizations = items;
      state.pagination = { page, pageSize, totalCount, hasMore };
      state.isLoading = false;
      state.error = null;
    },
    fetchOrganizationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create organization
    createOrganizationSuccess: (state, action) => {
      state.organizations.unshift(action.payload);
      state.pagination.totalCount += 1;
      state.isFormModalOpen = false;
      state.error = null;
    },

    // Update organization
    updateOrganizationSuccess: (state, action) => {
      const index = state.organizations.findIndex(org => org.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      state.isFormModalOpen = false;
      state.selectedOrganization = null;
      state.error = null;
    },

    // Delete organization
    deleteOrganizationSuccess: (state, action) => {
      state.organizations = state.organizations.filter(org => org.id !== action.payload);
      state.pagination.totalCount -= 1;
      state.isDeleteModalOpen = false;
      state.selectedOrganization = null;
      state.error = null;
    },

    // Selection
    setSelectedOrganization: (state, action) => {
      state.selectedOrganization = action.payload;
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },

    // Modal controls
    openCreateModal: (state) => {
      state.isFormModalOpen = true;
      state.formMode = 'create';
      state.selectedOrganization = null;
      state.error = null;
    },
    openEditModal: (state, action) => {
      state.isFormModalOpen = true;
      state.formMode = 'edit';
      state.selectedOrganization = action.payload;
      state.error = null;
    },
    closeFormModal: (state) => {
      state.isFormModalOpen = false;
      state.selectedOrganization = null;
      state.error = null;
    },
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.selectedOrganization = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedOrganization = null;
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Pagination
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

    // Reset state (for logout)
    resetOrganizationState: () => initialState,
  },
});

export const {
  fetchOrganizationsStart,
  fetchOrganizationsSuccess,
  fetchOrganizationsFailure,
  createOrganizationSuccess,
  updateOrganizationSuccess,
  deleteOrganizationSuccess,
  setSelectedOrganization,
  clearSelectedOrganization,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
  setError,
  clearError,
  setPage,
  resetOrganizationState,
} = organizationSlice.actions;

// Selectors
export const selectOrganizations = (state) => state.organization.organizations;
export const selectSelectedOrganization = (state) => state.organization.selectedOrganization;
export const selectPagination = (state) => state.organization.pagination;
export const selectOrganizationLoading = (state) => state.organization.isLoading;
export const selectOrganizationError = (state) => state.organization.error;
export const selectIsFormModalOpen = (state) => state.organization.isFormModalOpen;
export const selectIsDeleteModalOpen = (state) => state.organization.isDeleteModalOpen;
export const selectFormMode = (state) => state.organization.formMode;

export default organizationSlice.reducer;

