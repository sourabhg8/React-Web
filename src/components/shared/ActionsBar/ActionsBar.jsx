import styles from './ActionsBar.module.css';

/**
 * ActionsBar Component
 * Reusable action bar with search and buttons
 */
const ActionsBar = ({ 
  searchPlaceholder = 'Search...', 
  searchValue = '',
  onSearchChange,
  children 
}) => {
  return (
    <div className={styles.actionsBar}>
      <div className={styles.searchBox}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className={styles.searchInput}
        />
        {searchValue && (
          <button 
            className={styles.clearBtn}
            onClick={() => onSearchChange?.('')}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <div className={styles.actions}>
        {children}
      </div>
    </div>
  );
};

/**
 * ActionButton Component
 * Primary action button for the actions bar
 */
export const ActionButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  const buttonClass = variant === 'secondary' ? styles.secondaryBtn : styles.primaryBtn;
  
  return (
    <button 
      className={buttonClass} 
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ActionsBar;

