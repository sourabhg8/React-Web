import { useState, useCallback, useEffect } from 'react';
import { SearchResults } from '../../components/search';
import { searchApi } from '../../api/searchApi';
import { loadRecentSearches, saveRecentSearch } from '../../utils/recentSearchStorage';
import styles from './Search.module.css';

/**
 * Research search — hybrid AI search over indexed medical literature.
 */
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [peakRelevanceScore, setPeakRelevanceScore] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    setRecentQueries(loadRecentSearches());
  }, []);

  const performSearch = useCallback(async (query, page = 1, filters = {}) => {
    if (!query.trim()) {
      setError('Please enter a research topic or question');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
      const searchPayload = {
        searchQuery: query.trim(),
        pageNumber: pageNum,
        pageSize: 10,
        filters: Object.keys(filters).length ? filters : undefined,
      };
      if (pageNum > 1 && peakRelevanceScore != null) {
        searchPayload.peakRelevanceScore = peakRelevanceScore;
      }

      const response = await searchApi.search(searchPayload);
      const data = response.data ?? response;

      if (pageNum === 1) {
        setPeakRelevanceScore(data.peakRelevanceScore ?? data.PeakRelevanceScore ?? null);
        setRecentQueries(saveRecentSearch(query.trim()));
      }

      setSearchResponse(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.data?.message || err.message || 'Search failed. Please try again.');
      setSearchResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [peakRelevanceScore]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentFilters({});
    setPeakRelevanceScore(null);
    performSearch(searchQuery, 1, {});
  };

  const handlePageChange = (page) => {
    const p = typeof page === 'number' && !Number.isNaN(page) ? page : Number.parseInt(String(page), 10);
    performSearch(searchQuery, Number.isFinite(p) && p > 0 ? p : 1, currentFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFacetClick = (field, value) => {
    const current = currentFilters[field] ?? [];
    const isSelected = current.includes(value);
    const next = isSelected
      ? current.filter((v) => v !== value)
      : [...current, value];
    const updated = next.length
      ? { ...currentFilters, [field]: next }
      : (() => {
          const rest = { ...currentFilters };
          delete rest[field];
          return rest;
        })();
    setCurrentFilters(updated);
    setPeakRelevanceScore(null);
    performSearch(searchQuery, 1, updated);
  };

  const handleResultClick = (result) => {
    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  const handleRecentQuery = (term) => {
    setSearchQuery(term);
    setCurrentFilters({});
    setPeakRelevanceScore(null);
    performSearch(term, 1, {});
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResponse(null);
    setHasSearched(false);
    setError(null);
    setCurrentFilters({});
    setPeakRelevanceScore(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.searchHeader}>
          <h1 className={styles.title}>Research Search</h1>
          <p className={styles.subtitle}>
            Search indexed medical literature with AI-powered relevance ranking and summaries
          </p>
        </header>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              placeholder="e.g. metformin cardiovascular outcomes, CAR-T therapy..."
              aria-label="Research search query"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className={styles.searchBtn} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.btnSpinner} />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {!hasSearched && recentQueries.length > 0 && (
          <div className={styles.recentSearches}>
            <span className={styles.recentLabel}>Recent:</span>
            <div className={styles.recentTags}>
              {recentQueries.map((term) => (
                <button
                  key={term}
                  type="button"
                  className={styles.recentTag}
                  onClick={() => handleRecentQuery(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasSearched && (
          <div className={styles.resultsSection}>
            <SearchResults
              searchResponse={searchResponse}
              isLoading={isLoading}
              error={error}
              selectedFilters={currentFilters}
              onResultClick={handleResultClick}
              onPageChange={handlePageChange}
              onFacetClick={handleFacetClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
