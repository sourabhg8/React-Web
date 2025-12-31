import styles from './Pagination.module.css';

/**
 * Pagination Component
 * Reusable pagination with info and navigation
 */
const Pagination = ({
  currentPage,
  pageSize,
  totalCount,
  hasMore,
  onPageChange,
  itemLabel = 'items',
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  if (totalCount === 0) return null;

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        Showing {startItem} to {endItem} of {totalCount} {itemLabel}
      </span>
      <div className={styles.paginationButtons}>
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Previous
        </button>
        <span className={styles.pageNumber}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.paginationBtn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore}
        >
          Next
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

