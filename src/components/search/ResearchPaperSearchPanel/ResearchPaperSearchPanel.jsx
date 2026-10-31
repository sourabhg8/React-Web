import SearchResults from '../SearchResults';
import styles from './ResearchPaperSearchPanel.module.css';

/**
 * Research paper search results (existing hybrid literature search).
 */
const ResearchPaperSearchPanel = ({
  searchResponse,
  isLoading,
  error,
  selectedFilters,
  onResultClick,
  onPageChange,
  onFacetClick,
  savedSearchLastSearchedAt,
  hasSearched,
}) => {
  if (!hasSearched && !isLoading) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M12 21V7" />
            <path d="M12 7a4 4 0 0 0-4-4H4v16a3 3 0 0 1 3-3h5" />
            <path d="M12 7a4 4 0 0 1 4-4h4v16a3 3 0 0 0-3-3h-5" />
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>Research paper search</h3>
        <p className={styles.emptyText}>
          Search indexed publications, PMC passages, and clinical literature. Use filters to
          refine by source and publication year.
        </p>
      </div>
    );
  }

  return (
    <SearchResults
      searchResponse={searchResponse}
      isLoading={isLoading}
      error={error}
      selectedFilters={selectedFilters}
      onResultClick={onResultClick}
      onPageChange={onPageChange}
      onFacetClick={onFacetClick}
      savedSearchLastSearchedAt={savedSearchLastSearchedAt}
      showYearFacets
    />
  );
};

export default ResearchPaperSearchPanel;
