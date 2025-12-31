import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  selectedUser: null,
  currentOrg: {
    orgId: null,
    orgName: null,
  },
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set current organization context
    setCurrentOrg: (state, action) => {
      state.currentOrg = action.payload;
    },

    // Fetch users
    fetchUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      const { items, totalCount, page, pageSize, hasMore } = action.payload;
      state.users = items;
      state.pagination = { page, pageSize, totalCount, hasMore };
      state.isLoading = false;
      state.error = null;
    },
    fetchUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create user
    createUserSuccess: (state, action) => {
      state.users.unshift(action.payload);
      state.pagination.totalCount += 1;
      state.isFormModalOpen = false;
      state.error = null;
    },

    // Update user
    updateUserSuccess: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.isFormModalOpen = false;
      state.selectedUser = null;
      state.error = null;
    },

    // Delete user
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.pagination.totalCount -= 1;
      state.isDeleteModalOpen = false;
      state.selectedUser = null;
      state.error = null;
    },

    // Selection
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    // Modal controls
    openCreateModal: (state) => {
      state.isFormModalOpen = true;
      state.formMode = 'create';
      state.selectedUser = null;
      state.error = null;
    },
    openEditModal: (state, action) => {
      state.isFormModalOpen = true;
      state.formMode = 'edit';
      state.selectedUser = action.payload;
      state.error = null;
    },
    closeFormModal: (state) => {
      state.isFormModalOpen = false;
      state.selectedUser = null;
      state.error = null;
    },
    openDeleteModal: (state, action) => {
      state.isDeleteModalOpen = true;
      state.selectedUser = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedUser = null;
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
    resetUserState: () => initialState,
  },
});

export const {
  setCurrentOrg,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess,
  setSelectedUser,
  clearSelectedUser,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
  setError,
  clearError,
  setPage,
  resetUserState,
} = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.user.users;
export const selectSelectedUser = (state) => state.user.selectedUser;
export const selectCurrentOrg = (state) => state.user.currentOrg;
export const selectUserPagination = (state) => state.user.pagination;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectIsUserFormModalOpen = (state) => state.user.isFormModalOpen;
export const selectIsUserDeleteModalOpen = (state) => state.user.isDeleteModalOpen;
export const selectUserFormMode = (state) => state.user.formMode;

export default userSlice.reducer;

