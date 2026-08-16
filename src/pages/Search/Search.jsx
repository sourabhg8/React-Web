import { useState, useCallback, useEffect } from 'react';
import { SearchResults } from '../../components/search';
import ConfirmModal from '../../components/common/ConfirmModal';
import { searchApi } from '../../api/searchApi';
import { loadRecentSearches, saveRecentSearch } from '../../utils/recentSearchStorage';
import { PREFERRED_SEARCHES_UPDATED } from '../../utils/preferredSearchEvents';
import styles from './Search.module.css';

const mapPreferredTerms = (response) => {
  const data = response?.data ?? response;
  const terms = data?.searchTerms ?? data?.SearchTerms ?? [];
  return Array.isArray(terms) ? terms : [];
};

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
  const [savedSearches, setSavedSearches] = useState([]);
  const [isSavingSearch, setIsSavingSearch] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingSaved, setIsDeletingSaved] = useState(false);
  const [savedSearchLastSearchedAt, setSavedSearchLastSearchedAt] = useState(null);

  const loadSavedSearches = useCallback(async () => {
    try {
      const response = await searchApi.getPreferredSearches();
      setSavedSearches(mapPreferredTerms(response));
    } catch (err) {
      console.error('Failed to load saved searches:', err);
    }
  }, []);

  useEffect(() => {
    setRecentQueries(loadRecentSearches());
    loadSavedSearches();

    const handlePreferredSearchesUpdated = () => {
      loadSavedSearches();
    };

    window.addEventListener(PREFERRED_SEARCHES_UPDATED, handlePreferredSearchesUpdated);
    return () => {
      window.removeEventListener(PREFERRED_SEARCHES_UPDATED, handlePreferredSearchesUpdated);
    };
  }, [loadSavedSearches]);

  const performSearch = useCallback(async (query, page = 1, filters = {}) => {
    if (!query.trim()) {
      setError('Please enter a research topic or question');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSaveMessage(null);

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
    setSavedSearchLastSearchedAt(null);
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
    setSavedSearchLastSearchedAt(null);
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
    setSavedSearchLastSearchedAt(null);
    performSearch(term, 1, {});
  };

  const handleSavedQuery = async (savedItem) => {
    const term = savedItem.searchTerm ?? savedItem.SearchTerm;
    const lastSearchedAt =
      savedItem.searchTermLastSearchedAt ?? savedItem.SearchTermLastSearchedAt ?? null;

    setSavedSearchLastSearchedAt(lastSearchedAt);
    setSearchQuery(term);
    setCurrentFilters({});
    setPeakRelevanceScore(null);

    performSearch(term, 1, {});

    try {
      const response = await searchApi.recordPreferredSearch(term);
      setSavedSearches(mapPreferredTerms(response));
    } catch (err) {
      console.error('Failed to record saved search:', err);
    }
  };

  const handleSaveSearch = async () => {
    const term = searchQuery.trim();
    if (!term) return;

    setIsSavingSearch(true);
    setSaveMessage(null);

    try {
      const response = await searchApi.savePreferredSearch(term);
      setSavedSearches(mapPreferredTerms(response));
      setSaveMessage('Search saved');
    } catch (err) {
      console.error('Failed to save search:', err);
      setSaveMessage(err.data?.message || err.message || 'Could not save search');
    } finally {
      setIsSavingSearch(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResponse(null);
    setHasSearched(false);
    setError(null);
    setCurrentFilters({});
    setPeakRelevanceScore(null);
    setSaveMessage(null);
    setSavedSearchLastSearchedAt(null);
  };

  const handleDeleteSavedSearch = async () => {
    if (!deleteTarget) return;

    setIsDeletingSaved(true);
    try {
      const response = await searchApi.deletePreferredSearch(deleteTarget);
      setSavedSearches(mapPreferredTerms(response));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete saved search:', err);
    } finally {
      setIsDeletingSaved(false);
    }
  };

  const isCurrentQuerySaved = savedSearches.some(
    (item) => item.searchTerm?.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
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
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSaveSearch}
              disabled={!searchQuery.trim() || isSavingSearch || isCurrentQuerySaved}
              title={isCurrentQuerySaved ? 'Already saved' : 'Save this search'}
            >
              {isSavingSearch ? 'Saving...' : isCurrentQuerySaved ? 'Saved' : 'Save search'}
            </button>
          </div>
          {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}
        </form>

        {!hasSearched && (recentQueries.length > 0 || savedSearches.length > 0) && (
          <div className={styles.queryShortcuts}>
            {savedSearches.length > 0 && (
              <div className={styles.recentSearches}>
                <span className={styles.recentLabel}>Saved:</span>
                <div className={styles.recentTags}>
                  {savedSearches.map((item) => (
                    <div key={item.searchTerm} className={styles.savedTagItem}>
                      <button
                        type="button"
                        className={`${styles.recentTag} ${styles.savedTag}`}
                        onClick={() => handleSavedQuery(item)}
                      >
                        {item.searchTerm}
                      </button>
                      <button
                        type="button"
                        className={styles.savedTagDelete}
                        onClick={() => setDeleteTarget(item.searchTerm)}
                        aria-label={`Delete saved search ${item.searchTerm}`}
                        title="Delete saved search"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentQueries.length > 0 && (
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
              savedSearchLastSearchedAt={savedSearchLastSearchedAt}
            />
          </div>
        )}

        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => !isDeletingSaved && setDeleteTarget(null)}
          onConfirm={handleDeleteSavedSearch}
          title="Delete saved search"
          message={deleteTarget ? `Remove "${deleteTarget}" from your saved searches?` : ''}
          confirmLabel="Delete"
          isLoading={isDeletingSaved}
        />
      </div>
    </div>
  );
};

export default Search;
