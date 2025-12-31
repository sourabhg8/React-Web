import { API_BASE_URL, PUBLIC_API_ENDPOINTS } from '../utils/constants';
import { getToken, isTokenExpired, removeToken } from '../utils/tokenUtils';
import { store } from '../store';
import { setTokenExpired } from '../store/slices/authSlice';
import { openLoginModal, setGlobalLoader } from '../store/slices/uiSlice';

/**
 * Check if an endpoint is public (doesn't require authentication)
 * @param {string} endpoint - API endpoint
 * @returns {boolean}
 */
const isPublicEndpoint = (endpoint) => {
  return PUBLIC_API_ENDPOINTS.some((publicEndpoint) => endpoint.includes(publicEndpoint));
};

/**
 * Handle token expiration
 * Dispatches actions to clear auth state and open login modal
 */
const handleTokenExpiration = () => {
  store.dispatch(setTokenExpired());
  store.dispatch(openLoginModal());
};

/**
 * Create headers for API requests
 * @param {boolean} includeAuth - Whether to include auth token
 * @param {object} customHeaders - Additional headers
 * @returns {Headers}
 */
const createHeaders = (includeAuth = true, customHeaders = {}) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...customHeaders,
  });

  if (includeAuth) {
    const token = getToken();
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        handleTokenExpiration();
        throw new Error('TOKEN_EXPIRED');
      }
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
};

/**
 * Process API response
 * @param {Response} response - Fetch response
 * @param {boolean} isPublic - Whether this is a public endpoint (no auth required)
 * @returns {Promise<any>}
 */
const processResponse = async (response, isPublic = false) => {
  const data = await response.json();

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // For public endpoints (like login), return the actual API error message
    // For authenticated endpoints, treat as token expiration
    if (!isPublic) {
      handleTokenExpiration();
      throw new Error('TOKEN_EXPIRED');
    }
    // For public endpoints, throw the actual error message from API
    const error = new Error(data.message || 'Invalid username or password');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Main API client function
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @param {boolean} options.showLoader - Show global loader
 * @param {boolean} options.auth - Include auth token (default: auto-detect)
 * @returns {Promise<any>}
 */
export const apiClient = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body,
    showLoader = false,
    auth,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  // Determine if auth is needed
  const needsAuth = auth !== undefined ? auth : !isPublicEndpoint(endpoint);

  const url = `${API_BASE_URL}${endpoint}`;

  // Show loader if requested
  if (showLoader) {
    store.dispatch(setGlobalLoader(true));
  }

  try {
    const headers = createHeaders(needsAuth, customHeaders);

    const fetchOptions = {
      method,
      headers,
      ...restOptions,
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    return await processResponse(response, !needsAuth);
  } catch (error) {
    // Re-throw token expiration errors
    if (error.message === 'TOKEN_EXPIRED') {
      throw error;
    }

    // Network errors or other issues
    console.error('API Error:', error);
    throw error;
  } finally {
    if (showLoader) {
      store.dispatch(setGlobalLoader(false));
    }
  }
};

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional options
 */
export const get = (endpoint, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'GET' });
};

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional options
 */
export const post = (endpoint, body, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'POST', body });
};

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional options
 */
export const put = (endpoint, body, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'PUT', body });
};

/**
 * PATCH request helper
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional options
 */
export const patch = (endpoint, body, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'PATCH', body });
};

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional options
 */
export const del = (endpoint, options = {}) => {
  return apiClient(endpoint, { ...options, method: 'DELETE' });
};

// Named export for auth API calls (convenience)
export const authApi = {
  login: (credentials) => post('/auth/login', credentials, { auth: false, showLoader: true }),
  register: (userData) => post('/auth/register', userData, { auth: false, showLoader: true }),
  logout: () => post('/auth/logout', null, { showLoader: true }),
  refreshToken: () => post('/auth/refresh', null, { showLoader: false }),
  changePassword: (passwordData) => post('/auth/change-password', passwordData, { showLoader: true }),
};

export default {
  get,
  post,
  put,
  patch,
  del,
  authApi,
};

