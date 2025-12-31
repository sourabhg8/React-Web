import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY } from './constants';

/**
 * Save token to localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if token exists
 * @returns {boolean}
 */
export const hasToken = () => {
  return !!getToken();
};

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token payload or null
 */
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Extract user data from token
 * @param {string} token - JWT token
 * @returns {object|null} User object or null
 */
export const getUserFromToken = (token) => {
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Extract role/userType from the Microsoft claims format
  const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;

  return {
    id: decoded.sub,
    name: decoded.unique_name,
    email: decoded.email,
    userType: decoded.user_type || role, // Use user_type claim, fallback to role
    role: role, // Single role per user
    orgId: decoded.organisation_id,
    orgName: decoded.organisation_name,
  };
};

/**
 * Get time until token expires (in seconds)
 * @param {string} token - JWT token
 * @returns {number} Seconds until expiration or 0 if expired
 */
export const getTokenExpiryTime = (token) => {
  if (!token) return 0;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;

  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = decoded.exp - currentTime;

  return timeUntilExpiry > 0 ? Math.floor(timeUntilExpiry) : 0;
};

