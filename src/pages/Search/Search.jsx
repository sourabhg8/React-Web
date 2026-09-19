import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../../components/common/ConfirmModal';
import { setSearchSidebarOpen, selectSearchSidebarOpen } from '../../store/slices/uiSlice';
import SearchWorkspaceSidebar from '../../components/search/SearchWorkspaceSidebar';
import AdcSearchResults from '../../components/search/AdcSearchResults';
import ResearchPaperSearchPanel from '../../components/search/ResearchPaperSearchPanel';
import { searchApi } from '../../api/searchApi';
import { loadRecentSearches, saveRecentSearch } from '../../utils/recentSearchStorage';
import { PREFERRED_SEARCHES_UPDATED } from '../../utils/preferredSearchEvents';
import styles from './Search.module.css';

const TAB = {
  ADC: 'adc',
  RESEARCH: 'research',
};

const ADC_ALL_SOURCES = 'All';

const mapPreferredTerms = (response) => {
  const data = response?.data ?? response;
  const terms = data?.searchTerms ?? data?.SearchTerms ?? [];
  return Array.isArray(terms) ? terms : [];
};

const Search = () => {
  const dispatch = useDispatch();
  const searchSidebarOpen = useSelector(selectSearchSidebarOpen);
  const [activeTab, setActiveTab] = useState(TAB.ADC);
  const [searchQuery, setSearchQuery] = useState('');

  const [adcResponse, setAdcResponse] = useState(null);
  const [adcLoading, setAdcLoading] = useState(false);
  const [adcError, setAdcError] = useState(null);
  const [adcHasSearched, setAdcHasSearched] = useState(false);
  const [adcSourceFilter, setAdcSourceFilter] = useState(ADC_ALL_SOURCES);

  const [researchResponse, setResearchResponse] = useState(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState(null);
  const [researchHasSearched, setResearchHasSearched] = useState(false);
  const [researchFilters, setResearchFilters] = useState({});
  const [peakRelevanceScore, setPeakRelevanceScore] = useState(null);
  const [savedSearchLastSearchedAt, setSavedSearchLastSearchedAt] = useState(null);

  const [recentQueries, setRecentQueries] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isSavingSearch, setIsSavingSearch] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingSaved, setIsDeletingSaved] = useState(false);

  const loadSavedSearches = useCallback(async () => {
    try {
      const response = await searchApi.getPreferredSearches();
      setSavedSearches(mapPreferredTerms(response));
    } catch (err) {
      console.error('Failed to load saved searches:', err);
    }
  }, []);

  useEffect(() => {
    dispatch(setSearchSidebarOpen(false));
    return () => {
      dispatch(setSearchSidebarOpen(false));
    };
  }, [dispatch]);

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

  const runAdcSearch = useCallback(async (query, page = 1, sourceFilter = adcSourceFilter) => {
    if (!query.trim()) {
      setAdcError('Please enter a search term');
      return;
    }

    setAdcLoading(true);
    setAdcError(null);
    setAdcHasSearched(true);
    setSaveMessage(null);

    try {
      const filters =
        sourceFilter && sourceFilter !== ADC_ALL_SOURCES
          ? { sourceType: [sourceFilter] }
          : {};

      const data = await searchApi.adcSearch({
        searchQuery: query.trim(),
        pageNumber: page,
        pageSize: 10,
        filters: Object.keys(filters).length ? filters : undefined,
      });

      if (page === 1) {
        setRecentQueries(saveRecentSearch(query.trim()));
      }

      setAdcResponse(data);
    } catch (err) {
      console.error('ADC search error:', err);
      setAdcError(err.message || 'ADC search failed.');
      setAdcResponse(null);
    } finally {
      setAdcLoading(false);
    }
  }, [adcSourceFilter]);

  const runResearchSearch = useCallback(async (query, page = 1, filters = researchFilters) => {
    if (!query.trim()) {
      setResearchError('Please enter a research topic or question');
      return;
    }

    setResearchLoading(true);
    setResearchError(null);
    setResearchHasSearched(true);
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

      setResearchResponse(data);
    } catch (err) {
      console.error('Search error:', err);
      setResearchError(err.data?.message || err.message || 'Search failed. Please try again.');
      setResearchResponse(null);
    } finally {
      setResearchLoading(false);
    }
  }, [peakRelevanceScore, researchFilters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPeakRelevanceScore(null);
    setSavedSearchLastSearchedAt(null);
    if (activeTab === TAB.ADC) {
      setAdcSourceFilter(ADC_ALL_SOURCES);
      runAdcSearch(searchQuery, 1, ADC_ALL_SOURCES);
    } else {
      setResearchFilters({});
      runResearchSearch(searchQuery, 1, {});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSaveMessage(null);
    setSavedSearchLastSearchedAt(null);
    setPeakRelevanceScore(null);
    if (activeTab === TAB.ADC) {
      setAdcResponse(null);
      setAdcError(null);
      setAdcHasSearched(false);
      setAdcSourceFilter(ADC_ALL_SOURCES);
    } else {
      setResearchResponse(null);
      setResearchError(null);
      setResearchHasSearched(false);
      setResearchFilters({});
    }
  };

  const handleSidebarQuery = (term) => {
    dispatch(setSearchSidebarOpen(false));
    setSearchQuery(term);
    setPeakRelevanceScore(null);
    setSavedSearchLastSearchedAt(null);
    if (activeTab === TAB.ADC) {
      setAdcSourceFilter(ADC_ALL_SOURCES);
      runAdcSearch(term, 1, ADC_ALL_SOURCES);
    } else {
      setResearchFilters({});
      runResearchSearch(term, 1, {});
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSaveMessage(null);
  };

  const handleAdcSourceFilter = (source) => {
    setAdcSourceFilter(source);
    if (adcHasSearched && searchQuery.trim()) {
      runAdcSearch(searchQuery, 1, source);
    }
  };

  const handleResearchFacetClick = (field, value) => {
    const current = researchFilters[field] ?? [];
    const isSelected = current.includes(value);
    const next = isSelected ? current.filter((v) => v !== value) : [...current, value];
    const updated = next.length
      ? { ...researchFilters, [field]: next }
      : (() => {
          const rest = { ...researchFilters };
          delete rest[field];
          return rest;
        })();
    setResearchFilters(updated);
    setPeakRelevanceScore(null);
    setSavedSearchLastSearchedAt(null);
    runResearchSearch(searchQuery, 1, updated);
  };

  const handleResearchPageChange = (page) => {
    runResearchSearch(searchQuery, page, researchFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdcPageChange = (page) => {
    runAdcSearch(searchQuery, page, adcSourceFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultClick = (result) => {
    if (result.url) {
      window.open(result.url, '_blank');
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

  const isLoading = activeTab === TAB.ADC ? adcLoading : researchLoading;

  return (
    <div className={styles.workspace}>
      {searchSidebarOpen && (
        <button
          type="button"
          className={styles.sidebarBackdrop}
          aria-label="Close search menu"
          onClick={() => dispatch(setSearchSidebarOpen(false))}
        />
      )}

      <div
        className={`${styles.sidebarWrap} ${searchSidebarOpen ? styles.sidebarWrapOpen : ''}`}
      >
        <SearchWorkspaceSidebar
          recentQueries={recentQueries}
          savedSearches={savedSearches}
          onRunQuery={handleSidebarQuery}
          onDeleteSaved={setDeleteTarget}
        />
      </div>

      <div className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.tabs} role="tablist" aria-label="Search mode">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === TAB.ADC}
              className={`${styles.tab} ${activeTab === TAB.ADC ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(TAB.ADC)}
            >
              <span className={styles.tabTitle}>ADC search</span>
              <span className={styles.tabSub}>ADCs, antibodies, payloads, linkers</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === TAB.RESEARCH}
              className={`${styles.tab} ${activeTab === TAB.RESEARCH ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(TAB.RESEARCH)}
            >
              <span className={styles.tabTitle}>Research papers</span>
              <span className={styles.tabSub}>Publications &amp; indexed literature</span>
            </button>
          </div>

          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <div className={styles.searchWrapper}>
              <svg className={styles.searchIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                placeholder={
                  activeTab === TAB.ADC
                    ? 'e.g. BL-B01D1, trastuzumab deruxtecan, MMAE payload…'
                    : 'e.g. metformin cardiovascular outcomes, CAR-T therapy…'
                }
                aria-label="Search query"
              />
              {searchQuery && (
                <button type="button" className={styles.clearBtn} onClick={handleClearSearch} aria-label="Clear search">
                  ×
                </button>
              )}
              <button type="submit" className={styles.searchBtn} disabled={isLoading}>
                {isLoading ? <span className={styles.btnSpinner} /> : 'Search'}
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleSaveSearch}
                disabled={!searchQuery.trim() || isSavingSearch || isCurrentQuerySaved}
              >
                {isSavingSearch ? 'Saving…' : isCurrentQuerySaved ? 'Saved' : 'Save search'}
              </button>
            </div>
            {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}
          </form>

          <div className={styles.resultsPanel}>
            {activeTab === TAB.ADC ? (
              <AdcSearchResults
                searchResponse={adcHasSearched ? adcResponse : null}
                isLoading={adcLoading}
                error={adcError}
                selectedSource={adcSourceFilter}
                onSourceFilter={handleAdcSourceFilter}
                onPageChange={handleAdcPageChange}
              />
            ) : (
              <ResearchPaperSearchPanel
                hasSearched={researchHasSearched}
                searchResponse={researchResponse}
                isLoading={researchLoading}
                error={researchError}
                selectedFilters={researchFilters}
                onResultClick={handleResultClick}
                onPageChange={handleResearchPageChange}
                onFacetClick={handleResearchFacetClick}
                savedSearchLastSearchedAt={savedSearchLastSearchedAt}
              />
            )}
          </div>
        </div>
      </div>

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
  );
};

export default Search;
