import { get, post, put, del } from './apiClient';

/**
 * User API endpoints
 */
const USER_ENDPOINT = '/user';

/**
 * User API service
 */
export const userApi = {
  /**
   * Get all users (platform admin) or users by org (org admin)
   * @param {string} orgId - Organization ID (optional for platform admin)
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} - Paginated list of users
   */
  getAll: (orgId = null, page = 1, pageSize = 10) => {
    let url = `${USER_ENDPOINT}?page=${page}&pageSize=${pageSize}`;
    if (orgId) {
      url += `&orgId=${orgId}`;
    }
    return get(url, { showLoader: true });
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} - User details
   */
  getById: (id) => {
    return get(`${USER_ENDPOINT}/${id}`, { showLoader: true });
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} orgId - Organization ID
   * @param {string} orgName - Organization Name
   * @returns {Promise<Object>} - Created user
   */
  create: (userData, orgId, orgName) => {
    return post(`${USER_ENDPOINT}?orgId=${encodeURIComponent(orgId)}&orgName=${encodeURIComponent(orgName)}`, userData, { showLoader: true });
  },

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Updated user
   */
  update: (id, userData) => {
    return put(`${USER_ENDPOINT}/${id}`, userData, { showLoader: true });
  },

  /**
   * Delete a user (soft delete)
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Deletion result
   */
  delete: (id) => {
    return del(`${USER_ENDPOINT}/${id}`, { showLoader: true });
  },

  /**
   * Reset a user's password
   * Password will be reset to: first 4 letters of email + "_" + first 4 letters of name (lowercase)
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Reset result
   */
  resetPassword: (id) => {
    return post(`${USER_ENDPOINT}/${id}/reset-password`, {}, { showLoader: true });
  },
};

export default userApi;

