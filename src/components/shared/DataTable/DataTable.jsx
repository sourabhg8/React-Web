import styles from './DataTable.module.css';

/**
 * DataTable Component
 * Reusable table with loading, empty, and data states
 */
const DataTable = ({ 
  columns, 
  data, 
  isLoading, 
  emptyState,
  renderRow,
  keyExtractor = (item) => item.id,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          {emptyState || (
            <>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <h3>No Data Found</h3>
              <p>No records to display.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Data state
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key || index} style={column.width ? { width: column.width } : {}}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={keyExtractor(item, rowIndex)}>
              {renderRow ? (
                renderRow(item, rowIndex)
              ) : (
                columns.map((column, colIndex) => (
                  <td key={column.key || colIndex}>
                    {column.render 
                      ? column.render(item[column.key], item, rowIndex)
                      : item[column.key]
                    }
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * TableCell - Wrapper for common cell layouts
 */
export const TableCell = ({ children, className }) => (
  <td className={className}>{children}</td>
);

/**
 * AvatarCell - Cell with avatar and info
 */
export const AvatarCell = ({ avatar, title, subtitle }) => (
  <div className={styles.avatarCell}>
    <div className={styles.avatar}>{avatar}</div>
    <div className={styles.avatarInfo}>
      <span className={styles.avatarTitle}>{title}</span>
      {subtitle && <span className={styles.avatarSubtitle}>{subtitle}</span>}
    </div>
  </div>
);

/**
 * StatusBadge - Status indicator badge
 */
export const StatusBadge = ({ status, variant }) => {
  const variantClass = variant ? styles[`status${variant.charAt(0).toUpperCase() + variant.slice(1)}`] : '';
  return (
    <span className={`${styles.statusBadge} ${variantClass}`}>
      {status}
    </span>
  );
};

/**
 * ActionButtons - Container for row action buttons
 */
export const ActionButtons = ({ children }) => (
  <div className={styles.actionButtons}>{children}</div>
);

/**
 * ActionButton - Individual action button
 */
export const ActionBtn = ({ icon, onClick, title, variant = 'default' }) => {
  const variantClass = variant !== 'default' ? styles[`${variant}Btn`] : '';
  return (
    <button
      className={`${styles.actionBtn} ${variantClass}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  );
};

export default DataTable;

