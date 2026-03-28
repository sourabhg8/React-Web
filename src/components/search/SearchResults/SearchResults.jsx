import SearchResultItem from '../SearchResultItem';
import styles from './SearchResults.module.css';

/**
 * Parse facetCounts from API into groups by field name.
 * API returns { "source:PubMed": 30, "year:2024": 20 } -> { source: [{ value: "PubMed", count: 30 }], year: [...] }
 */
function parseFacetCounts(facetCounts) {
  if (!facetCounts || typeof facetCounts !== 'object') return { source: [], year: [] };
  const groups = { source: [], year: [] };
  for (const [key, count] of Object.entries(facetCounts)) {
    const colon = key.indexOf(':');
    if (colon === -1) continue;
    const field = key.slice(0, colon);
    const value = key.slice(colon + 1);
    if (field in groups) {
      groups[field].push({ value, count });
    }
  }
  // Sort by count descending
  groups.source.sort((a, b) => b.count - a.count);
  groups.year.sort((a, b) => b.count - a.count);
  return groups;
}

/**
 * SearchResults Component
 * Shows Year and Source facets at the top, then results from search API with pagination.
 */
const SearchResults = ({
  searchResponse,
  isLoading,
  error,
  selectedFilters = {},
  onResultClick,
  onPageChange,
  onFacetClick,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>Search Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // No results state
  if (!searchResponse || searchResponse.results?.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <h3>No results found</h3>
          <p>
            {searchResponse?.sanitizedQuery 
              ? `No results for "${searchResponse.sanitizedQuery}"`
              : 'Try adjusting your search terms or filters'}
          </p>
        </div>
      </div>
    );
  }

  const {
    results = [],
    totalResults: rawTotal = 0,
    pageNumber: rawPageNum = 1,
    pageSize: rawPageSize = 10,
    totalPages: rawTotalPages = 0,
    hasNextPage: rawHasNext,
    hasPreviousPage: rawHasPrev,
    searchTimeMs = 0,
    sanitizedQuery = '',
    facetCounts = {},
  } = searchResponse;

  const aiSummary =
    searchResponse.aiSummary ?? searchResponse.AiSummary ?? undefined;

  const totalResults = Number(rawTotal) || 0;
  const pageNumber = Math.max(1, Number(rawPageNum) || 1);
  const pageSize = Math.max(1, Number(rawPageSize) || 10);
  const totalPagesFromApi = Number(rawTotalPages);
  const totalPages =
    Number.isFinite(totalPagesFromApi) && totalPagesFromApi >= 0
      ? totalPagesFromApi
      : Math.max(0, Math.ceil(totalResults / pageSize));

  const hasPreviousPage =
    typeof rawHasPrev === 'boolean' ? rawHasPrev : pageNumber > 1;
  const hasNextPage =
    typeof rawHasNext === 'boolean'
      ? rawHasNext
      : totalPages > 0 && pageNumber < totalPages;

  const { source: sourceFacets, year: yearFacets } = parseFacetCounts(facetCounts);
  const selectedSource = selectedFilters.source ?? [];
  const selectedYear = selectedFilters.year ?? [];

  const isFacetSelected = (field, value) =>
    (selectedFilters[field] ?? []).includes(value);

  return (
    <div className={styles.container}>
      {/* Facets at the top: Source and Year */}
      {(sourceFacets.length > 0 || yearFacets.length > 0) && (
        <div className={styles.facetsTop}>
          {sourceFacets.length > 0 && (
            <div className={styles.facetGroup}>
              <span className={styles.facetLabel}>Source</span>
              <div className={styles.facetChips}>
                {sourceFacets.map(({ value, count }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.facetButton} ${isFacetSelected('source', value) ? styles.facetButtonSelected : ''}`}
                    onClick={() => onFacetClick?.('source', value)}
                  >
                    {value}
                    <span className={styles.facetCount}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {yearFacets.length > 0 && (
            <div className={styles.facetGroup}>
              <span className={styles.facetLabel}>Year</span>
              <div className={styles.facetChips}>
                {yearFacets.map(({ value, count }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.facetButton} ${isFacetSelected('year', value) ? styles.facetButtonSelected : ''}`}
                    onClick={() => onFacetClick?.('year', value)}
                  >
                    {value}
                    <span className={styles.facetCount}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Google-style featured answer (only when API returns aiSummary) */}
      {typeof aiSummary === 'string' && aiSummary.trim().length > 0 && (
        <div className={styles.featuredAnswer} role="region" aria-label="AI summary">
          <div className={styles.featuredAnswerLabel}>AI overview</div>
          <p className={styles.featuredAnswerText}>{aiSummary.trim()}</p>
        </div>
      )}

      {/* Results Header */}
      <div className={styles.header}>
        <div className={styles.resultInfo}>
          <h2 className={styles.resultCount}>
            <span className={styles.countNumber}>{totalResults}</span>
            {totalResults === 1 ? ' result' : ' results'}
            {sanitizedQuery && (
              <span className={styles.queryText}> for &quot;{sanitizedQuery}&quot;</span>
            )}
          </h2>
          <span className={styles.searchTime}>
            ({searchTimeMs}ms)
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className={styles.resultsList}>
        {results.map((result, index) => (
          <SearchResultItem
            key={result.id || index}
            result={result}
            onClick={onResultClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalResults > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((pageNumber - 1) * pageSize) + 1} - {Math.min(pageNumber * pageSize, totalResults)} of {totalResults}
          </div>
          
          <div className={styles.paginationControls}>
            <button
              className={styles.pageButton}
              onClick={() => onPageChange?.(1)}
              disabled={pageNumber === 1}
              aria-label="First page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            </button>
            
            <button
              className={styles.pageButton}
              onClick={() => onPageChange?.(pageNumber - 1)}
              disabled={!hasPreviousPage}
              aria-label="Previous page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className={styles.pageNumbers}>
              {generatePageNumbers(pageNumber, totalPages).map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
                ) : (
                  <button
                    key={`page-${page}-${index}`}
                    className={`${styles.pageNumber} ${page === pageNumber ? styles.active : ''}`}
                    type="button"
                    onClick={() => typeof page === 'number' && onPageChange?.(page)}
                    aria-current={page === pageNumber ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              className={styles.pageButton}
              onClick={() => onPageChange?.(pageNumber + 1)}
              disabled={!hasNextPage}
              aria-label="Next page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            
            <button
              className={styles.pageButton}
              onClick={() => onPageChange?.(totalPages)}
              disabled={pageNumber === totalPages}
              aria-label="Last page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Generate array of page numbers to display
 */
function generatePageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  
  // Always show first page
  pages.push(1);
  
  if (current > 3) {
    pages.push('...');
  }
  
  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (current < total - 2) {
    pages.push('...');
  }
  
  // Always show last page
  if (total > 1) {
    pages.push(total);
  }
  
  return pages;
}

export default SearchResults;

