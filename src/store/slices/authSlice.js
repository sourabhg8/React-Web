import { createSlice } from '@reduxjs/toolkit';
import { saveToken, removeToken, getToken, getUserFromToken, isTokenExpired } from '../../utils/tokenUtils';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Try to restore auth state from localStorage on initial load
const getInitialState = () => {
  const token = getToken();
  
  if (token && !isTokenExpired(token)) {
    const user = getUserFromToken(token);
    return {
      ...initialState,
      user,
      token,
      isAuthenticated: true,
    };
  }
  
  // Clean up expired token
  if (token) {
    removeToken();
  }
  
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.error = null;
      saveToken(token);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      removeToken();
    },
    restoreAuth: (state) => {
      const token = getToken();
      if (token && !isTokenExpired(token)) {
        const user = getUserFromToken(token);
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (token) {
          removeToken();
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokenExpired: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeToken();
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  restoreAuth,
  clearError,
  setTokenExpired,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.userType;

export default authSlice.reducer;

