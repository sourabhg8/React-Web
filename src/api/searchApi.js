import { get, post } from './apiClient';

/**
 * Search API endpoints
 */
const SEARCH_ENDPOINT = '/search';

/**
 * Search API service
 */
export const searchApi = {
  /**
   * Perform a search with full options
   * @param {Object} searchRequest - Search request object
   * @param {string} searchRequest.searchQuery - The search query
   * @param {number} searchRequest.pageNumber - Page number (default: 1)
   * @param {number} searchRequest.pageSize - Results per page (default: 10)
   * @param {string} [searchRequest.category] - Optional category filter
   * @param {string} [searchRequest.type] - Optional type filter
   * @returns {Promise<Object>} - Search response with results and pagination
   */
  search: (searchRequest) => {
    return post(SEARCH_ENDPOINT, searchRequest, { showLoader: true });
  },

  /**
   * Quick search (GET request)
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Results per page (default: 10)
   * @returns {Promise<Object>} - Search response
   */
  quickSearch: (query, page = 1, pageSize = 10) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    return get(`${SEARCH_ENDPOINT}?${params}`, { showLoader: false });
  },
};

export default searchApi;

