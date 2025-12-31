import { get, post, put, del } from './apiClient';

/**
 * Organization API endpoints
 */
const ORGANIZATION_ENDPOINT = '/organization';

/**
 * Organization API service
 */
export const organizationApi = {
  /**
   * Get all organizations with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} - Paginated list of organizations
   */
  getAll: (page = 1, pageSize = 10) => {
    return get(`${ORGANIZATION_ENDPOINT}?page=${page}&pageSize=${pageSize}`, { showLoader: true });
  },

  /**
   * Get organization by ID
   * @param {string} id - Organization ID
   * @returns {Promise<Object>} - Organization details
   */
  getById: (id) => {
    return get(`${ORGANIZATION_ENDPOINT}/${id}`, { showLoader: true });
  },

  /**
   * Create a new organization
   * @param {Object} organizationData - Organization data
   * @returns {Promise<Object>} - Created organization
   */
  create: (organizationData) => {
    return post(ORGANIZATION_ENDPOINT, organizationData, { showLoader: true });
  },

  /**
   * Update an existing organization
   * @param {string} id - Organization ID
   * @param {Object} organizationData - Updated organization data
   * @returns {Promise<Object>} - Updated organization
   */
  update: (id, organizationData) => {
    return put(`${ORGANIZATION_ENDPOINT}/${id}`, organizationData, { showLoader: true });
  },

  /**
   * Delete an organization (soft delete)
   * @param {string} id - Organization ID
   * @returns {Promise<Object>} - Deletion result
   */
  delete: (id) => {
    return del(`${ORGANIZATION_ENDPOINT}/${id}`, { showLoader: true });
  },
};

export default organizationApi;

