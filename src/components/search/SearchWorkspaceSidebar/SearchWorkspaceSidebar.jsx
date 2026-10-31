import styles from './SearchWorkspaceSidebar.module.css';

const IconRecent = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </svg>
);

const IconSaved = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const ChevronGo = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const QueryRowButton = ({ term, variant, onClick }) => (
  <button
    type="button"
    className={`${styles.queryBtn} ${variant === 'saved' ? styles.queryBtnSaved : styles.queryBtnRecent}`}
    onClick={onClick}
  >
    <span className={styles.queryAccent} aria-hidden />
    <span className={styles.queryIconWrap}>
      <IconSearch />
    </span>
    <span className={styles.queryText}>{term}</span>
    <span className={styles.queryGo} aria-hidden>
      <ChevronGo />
    </span>
  </button>
);

const SearchWorkspaceSidebar = ({
  recentQueries = [],
  savedSearches = [],
  onRunQuery,
  onDeleteSaved,
}) => {
  const savedCount = savedSearches.length;

  return (
    <aside className={styles.sidebar} aria-label="Recent and saved searches">
      <div className={styles.sidebarMesh} aria-hidden />
      <div className={styles.sidebarAtmosphere} aria-hidden />
      <div className={styles.sidebarOrb sidebarOrbGreen} aria-hidden />
      <div className={styles.sidebarOrb sidebarOrbBlue} aria-hidden />

      <header className={styles.sidebarHeader}>
        <div className={styles.headerCard}>
          <span className={styles.sidebarAccentBar} aria-hidden />
          <h2 className={styles.sidebarTitle}>
            <span className={styles.sidebarTitleGradient}>Research workspace</span>
          </h2>
          <p className={styles.sidebarTagline}>Pick up where you left off</p>
          <dl className={styles.headerStats}>
            <div className={styles.statItem}>
              <dt>Recent</dt>
              <dd>{recentQueries.length}</dd>
            </div>
            <div className={styles.statDivider} aria-hidden />
            <div className={styles.statItem}>
              <dt>Saved</dt>
              <dd>{savedCount}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className={styles.sectionsWrap}>
        <section
          className={`${styles.sectionBlock} ${styles.sectionBlockRecent}`}
          aria-labelledby="sidebar-recent-heading"
        >
          <div className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <h3 id="sidebar-recent-heading" className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleMain} ${styles.sectionTitleRecent}`}>
                  <span className={styles.sectionIcon}>
                    <IconRecent />
                  </span>
                  Recent
                </span>
                <span className={`${styles.sectionCount} ${styles.sectionCountRecent}`}>
                  {recentQueries.length}
                </span>
              </h3>
            </div>
            <div className={styles.sectionScroll}>
              {recentQueries.length === 0 ? (
                <div className={styles.emptyCard}>
                  <span className={`${styles.emptyIcon} ${styles.emptyIconRecent}`} aria-hidden>
                    <IconRecent />
                  </span>
                  <p className={styles.emptyHint}>Your recent searches will appear here.</p>
                </div>
              ) : (
                <ul className={styles.queryList}>
                  {recentQueries.map((term, index) => (
                    <li key={term} style={{ '--row-index': index }}>
                      <QueryRowButton term={term} variant="recent" onClick={() => onRunQuery?.(term)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section
          className={`${styles.sectionBlock} ${styles.sectionBlockSaved}`}
          aria-labelledby="sidebar-saved-heading"
        >
          <div className={`${styles.sectionPanel} ${styles.sectionPanelSaved}`}>
            <div className={styles.sectionHeader}>
              <h3 id="sidebar-saved-heading" className={styles.sectionTitle}>
                <span className={`${styles.sectionTitleMain} ${styles.sectionTitleSaved}`}>
                  <span className={styles.sectionIcon}>
                    <IconSaved />
                  </span>
                  Saved
                </span>
                <span className={`${styles.sectionCount} ${styles.sectionCountSaved}`}>{savedCount}</span>
              </h3>
            </div>
            <div className={styles.sectionScroll}>
              {savedCount === 0 ? (
                <div className={styles.emptyCard}>
                  <span className={`${styles.emptyIcon} ${styles.emptyIconSaved}`} aria-hidden>
                    <IconSaved />
                  </span>
                  <p className={styles.emptyHint}>Save a query from the search bar to pin it here.</p>
                </div>
              ) : (
                <ul className={styles.queryList}>
                  {savedSearches.map((item, index) => {
                    const term = item.searchTerm ?? item.SearchTerm;
                    return (
                      <li key={term} className={styles.savedRow} style={{ '--row-index': index }}>
                        <QueryRowButton term={term} variant="saved" onClick={() => onRunQuery?.(term)} />
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
          </div>
        </section>
      </div>
    </aside>
  );
};

export default SearchWorkspaceSidebar;
