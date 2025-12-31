import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectIsAuthenticated,
  selectUser,
  restoreAuth,
} from '../../../store/slices/authSlice';
import { openLoginModal } from '../../../store/slices/uiSlice';
import { getToken, isTokenExpired } from '../../../utils/tokenUtils';
import { ROUTES, ROLES } from '../../../utils/constants';
import { Loader } from '../../common';

/**
 * AuthGuard component for protecting routes
 * - Checks authentication status
 * - Restores auth from token if page is refreshed
 * - Shows login modal if token is expired
 * - Can restrict access based on user types/roles
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Protected content
 * @param {string|string[]} props.allowedRoles - User types allowed to access
 * @param {string} props.redirectTo - Where to redirect if unauthorized
 */
const AuthGuard = ({ 
  children, 
  allowedRoles = null,
  redirectTo = ROUTES.HOME 
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    // Check if we have a token but no user in Redux (page refresh scenario)
    const token = getToken();
    
    if (token && !isAuthenticated) {
      if (isTokenExpired(token)) {
        // Token is expired, show login modal
        dispatch(openLoginModal());
      } else {
        // Restore auth from token
        dispatch(restoreAuth());
      }
    } else if (!token && !isAuthenticated) {
      // No token, show login modal
      dispatch(openLoginModal());
    }
  }, [dispatch, isAuthenticated]);

  // Get token to check expiration
  const token = getToken();

  // If no token at all, redirect to home and show login modal
  if (!token) {
    dispatch(openLoginModal());
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If token is expired, redirect and show login modal
  if (isTokenExpired(token)) {
    dispatch(openLoginModal());
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but no user yet (restoring), show loader
  if (!user) {
    return <Loader fullScreen text="Authenticating..." />;
  }

  // Check role-based access using userType
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userType = user.userType;
    
    if (!roles.includes(userType)) {
      // User doesn't have required role, redirect to their appropriate page
      let appropriateRoute = ROUTES.HOME;
      
      switch (userType) {
        case ROLES.PLATFORM_ADMIN:
          appropriateRoute = ROUTES.ALL_ORGANISATIONS;
          break;
        case ROLES.ORG_ADMIN:
          appropriateRoute = `${ROUTES.USERS}?orgId=${user.orgId}&orgName=${encodeURIComponent(user.orgName)}`;
          break;
        case ROLES.ORG_USER:
          appropriateRoute = ROUTES.SEARCH;
          break;
        default:
          appropriateRoute = ROUTES.HOME;
      }
      
      return <Navigate to={appropriateRoute} replace />;
    }
  }

  // All checks passed, render protected content
  return children;
};

export default AuthGuard;
