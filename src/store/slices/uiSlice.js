import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoginModalOpen: false,
  isLoading: false,
  globalLoader: false,
  notification: null,
  modalContent: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGlobalLoader: (state, action) => {
      state.globalLoader = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        type: action.payload.type, // 'success', 'error', 'warning', 'info'
        message: action.payload.message,
        duration: action.payload.duration || 3000,
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setModalContent: (state, action) => {
      state.modalContent = action.payload;
    },
    clearModalContent: (state) => {
      state.modalContent = null;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  setLoading,
  setGlobalLoader,
  showNotification,
  clearNotification,
  setModalContent,
  clearModalContent,
} = uiSlice.actions;

// Selectors
export const selectIsLoginModalOpen = (state) => state.ui.isLoginModalOpen;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectGlobalLoader = (state) => state.ui.globalLoader;
export const selectNotification = (state) => state.ui.notification;
export const selectModalContent = (state) => state.ui.modalContent;

export default uiSlice.reducer;

