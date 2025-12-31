import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import organizationReducer from './slices/organizationSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    organization: organizationReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/setModalContent'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.component'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.modalContent'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;

