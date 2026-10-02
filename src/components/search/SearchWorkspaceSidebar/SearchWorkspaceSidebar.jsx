import styles from './SearchWorkspaceSidebar.module.css';

const SearchWorkspaceSidebar = ({
  recentQueries = [],
  savedSearches = [],
  onRunQuery,
  onDeleteSaved,
}) => {
  const savedCount = savedSearches.length;

  return (
    <aside className={styles.sidebar} aria-label="Search workspace">
      <div className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div>
          <div className={styles.brandTitle}>ADC Research</div>
          <div className={styles.brandSub}>Search workspace</div>
        </div>
      </div>

      <div className={styles.sectionsWrap}>
        <section className={`${styles.sectionBlock} ${styles.sectionBlockRecent}`} aria-labelledby="sidebar-recent-heading">
          <div className={styles.sectionHeader}>
            <h2 id="sidebar-recent-heading" className={styles.sectionTitle}>
              Recent
              <span className={styles.sectionCount}>{recentQueries.length}</span>
            </h2>
          </div>
          <div className={styles.sectionScroll}>
            {recentQueries.length === 0 ? (
              <p className={styles.emptyHint}>Recent searches appear here.</p>
            ) : (
              <ul className={styles.queryList}>
                {recentQueries.map((term) => (
                  <li key={term}>
                    <button type="button" className={styles.queryBtn} onClick={() => onRunQuery?.(term)}>
                      <span className={styles.queryText}>{term}</span>
                      <span className={styles.queryAction} aria-hidden>↗</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className={`${styles.sectionBlock} ${styles.sectionBlockSaved}`} aria-labelledby="sidebar-saved-heading">
          <div className={styles.sectionHeader}>
            <h2 id="sidebar-saved-heading" className={styles.sectionTitle}>
              Saved searches
              <span className={styles.sectionCount}>{savedCount}</span>
            </h2>
          </div>
          <div className={styles.sectionScroll}>
            {savedCount === 0 ? (
              <p className={styles.emptyHint}>Save a search from the bar above.</p>
            ) : (
              <ul className={styles.queryList}>
                {savedSearches.map((item) => {
                  const term = item.searchTerm ?? item.SearchTerm;
                  return (
                    <li key={term} className={styles.savedRow}>
                      <button type="button" className={styles.queryBtn} onClick={() => onRunQuery?.(term)}>
                        <span className={styles.queryText}>{term}</span>
                        <span className={styles.queryAction} aria-hidden>↗</span>
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => onDeleteSaved?.(term)}
                        aria-label={`Delete saved search ${term}`}
                      >
                        ×
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
