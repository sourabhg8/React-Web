import styles from './SearchWorkspaceSidebar.module.css';

const SearchWorkspaceSidebar = ({
  recentQueries = [],
  savedSearches = [],
  onRunQuery,
  onDeleteSaved,
}) => {
  const savedCount = savedSearches.length;

  return (
    <aside className={styles.sidebar} aria-label="Recent and saved searches">
      <div className={styles.sidebarAtmosphere} aria-hidden />
      <div className={styles.sidebarOrbBlue} aria-hidden />
      <div className={styles.sidebarOrbGreen} aria-hidden />

      <header className={styles.sidebarHeader}>
        <span className={styles.sidebarAccentBar} aria-hidden />
        <p className={styles.sidebarTagline}>Start from where you left off</p>
      </header>

      <div className={styles.sectionsWrap}>
        <section
          className={`${styles.sectionBlock} ${styles.sectionBlockRecent}`}
          aria-labelledby="sidebar-recent-heading"
        >
          <div className={styles.sectionHeader}>
            <h2 id="sidebar-recent-heading" className={styles.sectionTitle}>
              Recent
              <span className={styles.sectionCount}>{recentQueries.length}</span>
            </h2>
          </div>
          <div className={styles.sectionScroll}>
            {recentQueries.length === 0 ? (
              <p className={styles.emptyHint}>Your recent searches will appear here.</p>
            ) : (
              <ul className={styles.queryList}>
                {recentQueries.map((term) => (
                  <li key={term}>
                    <button type="button" className={styles.queryBtn} onClick={() => onRunQuery?.(term)}>
                      <span className={styles.queryText}>{term}</span>
                      <span className={styles.queryIcon} aria-hidden>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section
          className={`${styles.sectionBlock} ${styles.sectionBlockSaved}`}
          aria-labelledby="sidebar-saved-heading"
        >
          <div className={styles.sectionHeader}>
            <h2 id="sidebar-saved-heading" className={styles.sectionTitle}>
              Saved
              <span className={styles.sectionCount}>{savedCount}</span>
            </h2>
          </div>
          <div className={styles.sectionScroll}>
            {savedCount === 0 ? (
              <p className={styles.emptyHint}>Save a query from the search bar to pin it here.</p>
            ) : (
              <ul className={styles.queryList}>
                {savedSearches.map((item) => {
                  const term = item.searchTerm ?? item.SearchTerm;
                  return (
                    <li key={term} className={styles.savedRow}>
                      <button type="button" className={styles.queryBtn} onClick={() => onRunQuery?.(term)}>
                        <span className={styles.queryText}>{term}</span>
                        <span className={styles.queryIcon} aria-hidden>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => onDeleteSaved?.(term)}
                        aria-label={`Delete saved search ${term}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default SearchWorkspaceSidebar;
