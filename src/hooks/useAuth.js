import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  clearError,
  restoreAuth,
} from '../store/slices/authSlice';
import { openLoginModal, closeLoginModal } from '../store/slices/uiSlice';
import { resetOrganizationState } from '../store/slices/organizationSlice';
import { resetUserState } from '../store/slices/userSlice';
import { authApi } from '../api/apiClient';
import { ROLES, ROUTES } from '../utils/constants';

/**
 * Custom hook for authentication operations
 * Provides auth state and methods for login, logout, etc.
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);

  /**
   * Get redirect route based on user type
   */
  const getRedirectRoute = useCallback((userType, user) => {
    switch (userType) {
      case ROLES.PLATFORM_ADMIN:
        return ROUTES.ALL_ORGANISATIONS;
      case ROLES.ORG_ADMIN:
        // Redirect to users page with org info
        return `${ROUTES.USERS}?orgId=${user.orgId}&orgName=${encodeURIComponent(user.orgName)}`;
      default:
        return ROUTES.SEARCH;
    }
  }, []);

  /**
   * Login user with credentials
   * @param {object} credentials - { email, password }
   */
  const login = useCallback(
    async (credentials) => {
      dispatch(loginStart());

      try {
        const response = await authApi.login(credentials);

        if (response.success) {
          const { token, user } = response.data;

          dispatch(loginSuccess({ token, user }));
          dispatch(closeLoginModal());

          // Redirect based on user type
          const redirectRoute = getRedirectRoute(user.userType, user);
          navigate(redirectRoute);

          return { success: true, user };
        } else {
          dispatch(loginFailure(response.message || 'Login failed'));
          return { success: false, error: response.message };
        }
      } catch (err) {
        const errorMessage = err.message || 'An error occurred during login';
        dispatch(loginFailure(errorMessage));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch, navigate, getRedirectRoute]
  );

  /**
   * Logout user and reset all state
   */
  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(resetOrganizationState());
    dispatch(resetUserState());
    navigate(ROUTES.HOME);
  }, [dispatch, navigate]);

  /**
   * Open login modal
   */
  const showLoginModal = useCallback(() => {
    dispatch(openLoginModal());
  }, [dispatch]);

  /**
   * Close login modal
   */
  const hideLoginModal = useCallback(() => {
    dispatch(closeLoginModal());
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear authentication error
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Restore auth state from token
   */
  const restoreAuthState = useCallback(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Role(s) to check
   */
  const hasRole = useCallback(
    (roles) => {
      if (!userRole) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(userRole);
    },
    [userRole]
  );

  /**
   * Check if user is platform admin
   */
  const isPlatformAdmin = useCallback(() => hasRole(ROLES.PLATFORM_ADMIN), [hasRole]);

  /**
   * Check if user is org admin
   */
  const isOrgAdmin = useCallback(() => hasRole(ROLES.ORG_ADMIN), [hasRole]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    // Methods
    login,
    logout,
    showLoginModal,
    hideLoginModal,
    clearAuthError,
    restoreAuthState,
    hasRole,
    isPlatformAdmin,
    isOrgAdmin,
    getRedirectRoute,
  };
};

export default useAuth;

