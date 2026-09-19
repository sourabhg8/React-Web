import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/slices/authSlice';
import { ROUTES } from '../../../utils/constants';
import styles from './SearchWorkspaceSidebar.module.css';

const SearchWorkspaceSidebar = ({
  recentQueries = [],
  savedSearches = [],
  onRunQuery,
  onDeleteSaved,
  activeSection = 'search',
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

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

      <nav className={styles.nav}>
        <button type="button" className={`${styles.navItem} ${activeSection === 'search' ? styles.navItemActive : ''}`}>
          <span className={styles.navIcon}>⌕</span>
          Search
        </button>
        <button type="button" className={styles.navItem}>
          <span className={styles.navIcon}>◷</span>
          Search history
          {recentQueries.length > 0 && (
            <span className={styles.badge}>{recentQueries.length}</span>
          )}
        </button>
        <button type="button" className={styles.navItem}>
          <span className={styles.navIcon}>★</span>
          Saved searches
          {savedSearches.length > 0 && (
            <span className={styles.badge}>{savedSearches.length}</span>
          )}
        </button>
      </nav>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent</h2>
        </div>
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

      <div className={styles.sectionGrow}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Saved searches</h2>
        </div>
        {savedSearches.length === 0 ? (
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

      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </aside>
  );
};

export default SearchWorkspaceSidebar;
