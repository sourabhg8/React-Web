import { get, post } from './apiClient';

/**
 * Search API endpoints (POST /api/Search)
 */
const SEARCH_ENDPOINT = '/Search';
const PREFERRED_SEARCH_ENDPOINT = '/PreferredSearch';

/**
 * Search API service
 * Backend returns { success, message, data: SearchResponse, correlationId }
 */
export const searchApi = {
  search: (searchRequest) => {
    return post(SEARCH_ENDPOINT, searchRequest, { showLoader: true });
  },

  quickSearch: (query, page = 1, pageSize = 10) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    return get(`${SEARCH_ENDPOINT}?${params}`, { showLoader: false });
  },

  getPreferredSearches: () => get(PREFERRED_SEARCH_ENDPOINT, { showLoader: false }),

  savePreferredSearch: (searchTerm) =>
    post(PREFERRED_SEARCH_ENDPOINT, { searchTerm }, { showLoader: false }),

  recordPreferredSearch: (searchTerm) =>
    post(`${PREFERRED_SEARCH_ENDPOINT}/record`, { searchTerm }, { showLoader: false }),

  getDocumentAdcInfo: (documentTitle, searchQuery) =>
    post(`${SEARCH_ENDPOINT}/document-adc-info`, { documentTitle, searchQuery }, { showLoader: false }),
};

export default searchApi;

