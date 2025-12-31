import { useState, useCallback } from 'react';
import { SearchResults } from '../../components/search';
import { searchApi } from '../../api/searchApi';
import styles from './Search.module.css';

/**
 * Search Page
 * Full-featured search with results display
 */
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  // Perform search
  const performSearch = useCallback(async (query, page = 1, filters = {}) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchApi.search({
        searchQuery: query,
        pageNumber: page,
        pageSize: 10,
        ...filters,
      });

      setSearchResponse(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.data?.message || err.message || 'Search failed. Please try again.');
      setSearchResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentFilters({});
    performSearch(searchQuery, 1, {});
  };

  // Handle page change
  const handlePageChange = (page) => {
    performSearch(searchQuery, page, currentFilters);
    // Scroll to top of results
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...currentFilters, ...newFilters };
    setCurrentFilters(updatedFilters);
    performSearch(searchQuery, 1, updatedFilters);
  };

  // Handle result click
  const handleResultClick = (result) => {
    console.log('Result clicked:', result);
    // In a real app, navigate to the result URL
    if (result.url) {
      window.open(result.url, '_blank');
    }
  };

  // Handle quick search tag click
  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    setCurrentFilters({});
    performSearch(term, 1, {});
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResponse(null);
    setHasSearched(false);
    setError(null);
    setCurrentFilters({});
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            Search
          </h1>
          <p className={styles.subtitle}>
            Find documents, articles, help guides, and more
          </p>
        </div>

        {/* Search Form */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchWrapper}>
            <svg 
              className={styles.searchIcon}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              placeholder="Search for anything..."
              aria-label="Search query"
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
                <span className={styles.btnSpinner}></span>
              ) : (
                <>
                  <span>Search</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Search Tags */}
        <div className={styles.quickSearches}>
          <span className={styles.quickLabel}>Try:</span>
          <div className={styles.quickTags}>
            <button 
              type="button" 
              className={styles.quickTag}
              onClick={() => handleQuickSearch('getting started')}
            >
              getting started
            </button>
            <button 
              type="button" 
              className={styles.quickTag}
              onClick={() => handleQuickSearch('api documentation')}
            >
              API docs
            </button>
            <button 
              type="button" 
              className={styles.quickTag}
              onClick={() => handleQuickSearch('security')}
            >
              security
            </button>
            <button 
              type="button" 
              className={styles.quickTag}
              onClick={() => handleQuickSearch('tutorial')}
            >
              tutorials
            </button>
            <button 
              type="button" 
              className={styles.quickTag}
              onClick={() => handleQuickSearch('automation')}
            >
              automation
            </button>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className={styles.resultsSection}>
            <SearchResults
              searchResponse={searchResponse}
              isLoading={isLoading}
              error={error}
              onResultClick={handleResultClick}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Initial State - Browse Categories */}
        {!hasSearched && (
          <div className={styles.browseSection}>
            <h2 className={styles.sectionTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Browse by Category
            </h2>
            
            <div className={styles.categoriesGrid}>
              <button 
                className={styles.categoryCard}
                onClick={() => handleQuickSearch('document')}
              >
                <div className={`${styles.categoryIcon} ${styles.iconDocument}`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span className={styles.categoryName}>Documents</span>
                <span className={styles.categoryDesc}>Guides, manuals & references</span>
              </button>

              <button 
                className={styles.categoryCard}
                onClick={() => handleQuickSearch('article')}
              >
                <div className={`${styles.categoryIcon} ${styles.iconArticle}`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <span className={styles.categoryName}>Articles</span>
                <span className={styles.categoryDesc}>Blog posts & insights</span>
              </button>

              <button 
                className={styles.categoryCard}
                onClick={() => handleQuickSearch('help')}
              >
                <div className={`${styles.categoryIcon} ${styles.iconHelp}`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <span className={styles.categoryName}>Help Center</span>
                <span className={styles.categoryDesc}>FAQs & troubleshooting</span>
              </button>

              <button 
                className={styles.categoryCard}
                onClick={() => handleQuickSearch('feature')}
              >
                <div className={`${styles.categoryIcon} ${styles.iconFeature}`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className={styles.categoryName}>Features</span>
                <span className={styles.categoryDesc}>Product capabilities</span>
              </button>

              <button 
                className={styles.categoryCard}
                onClick={() => handleQuickSearch('tutorial')}
              >
                <div className={`${styles.categoryIcon} ${styles.iconTutorial}`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                </div>
                <span className={styles.categoryName}>Tutorials</span>
                <span className={styles.categoryDesc}>Step-by-step guides</span>
              </button>

              <button 
                className={styles.categoryCard}
                onClick={() => handleQuickSearch('news')}
              >
                <div className={`${styles.categoryIcon} ${styles.iconNews}`}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6z" />
                  </svg>
                </div>
                <span className={styles.categoryName}>News</span>
                <span className={styles.categoryDesc}>Updates & announcements</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
