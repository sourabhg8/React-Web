import styles from './SearchResultItem.module.css';

/**
 * Icons for different result types
 */
const TypeIcons = {
  document: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  article: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  feature: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  tutorial: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  news: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6z" />
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

/**
 * Get color class based on result type
 */
const getTypeColorClass = (type) => {
  const colorMap = {
    document: styles.typeDocument,
    article: styles.typeArticle,
    help: styles.typeHelp,
    feature: styles.typeFeature,
    tutorial: styles.typeTutorial,
    news: styles.typeNews,
  };
  return colorMap[type] || styles.typeDefault;
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * SearchResultItem Component
 * Displays a single search result item
 */
const SearchResultItem = ({ result, onClick }) => {
  const icon = TypeIcons[result.type] || TypeIcons.default;
  const typeColorClass = getTypeColorClass(result.type);

  const handleClick = () => {
    if (onClick) {
      onClick(result);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <article 
      className={styles.resultItem}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View ${result.title}`}
    >
      {/* Type Icon */}
      <div className={`${styles.iconWrapper} ${typeColorClass}`}>
        {icon}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{result.title}</h3>
          <div className={styles.badges}>
            <span className={`${styles.typeBadge} ${typeColorClass}`}>
              {result.type}
            </span>
            <span className={styles.categoryBadge}>
              {result.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>{result.description}</p>

        {/* Highlight / Snippet */}
        {result.highlight && (
          <p className={styles.highlight}>
            <span className={styles.highlightLabel}>...</span>
            {result.highlight}
          </p>
        )}

        {/* Footer with metadata */}
        <div className={styles.footer}>
          <span className={styles.date}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(result.createdAt)}
          </span>

          {result.metadata?.readTime && (
            <span className={styles.readTime}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              {result.metadata.readTime}
            </span>
          )}

          {result.metadata?.author && (
            <span className={styles.author}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {result.metadata.author}
            </span>
          )}

          <span className={styles.relevance}>
            Relevance: {result.relevanceScore}%
          </span>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className={styles.arrow}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </article>
  );
};

export default SearchResultItem;

