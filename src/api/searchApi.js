import { get, post } from './apiClient';

/**
 * Search API endpoints (POST /api/Search)
 */
const SEARCH_ENDPOINT = '/Search';

/**
 * Search API service
 * Backend returns { success, message, data: SearchResponse, correlationId }
 */
export const searchApi = {
  /**
   * Perform a search (POST) with query, pagination and filters.
   * @param {Object} searchRequest - Search request
   * @param {string} searchRequest.searchQuery - Search text
   * @param {number} searchRequest.pageNumber - Page (1-based)
   * @param {number} searchRequest.pageSize - Page size
   * @param {Object} [searchRequest.filters] - Filters/selected facets e.g. { source: ["PubMed"], year: ["2024"] }
   * @returns {Promise<Object>} - API response; use response.data for SearchResponse (results, facetCounts, etc.)
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

