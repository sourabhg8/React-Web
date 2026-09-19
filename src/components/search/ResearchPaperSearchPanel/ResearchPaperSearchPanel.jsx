import SearchResults from '../SearchResults';

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
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Research paper search</h3>
        <p>Search indexed publications, PMC chunks, and clinical literature sources.</p>
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
