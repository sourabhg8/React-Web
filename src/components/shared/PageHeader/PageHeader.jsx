import styles from './PageHeader.module.css';

/**
 * PageHeader Component
 * Reusable page header with badge, title, subtitle, and optional back button
 */
const PageHeader = ({ 
  badge, 
  title, 
  subtitle, 
  onBack, 
  backLabel = 'Back',
  children 
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {backLabel}
          </button>
        )}
        {badge && <span className={styles.badge}>{badge}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children && <div className={styles.headerRight}>{children}</div>}
    </div>
  );
};

export default PageHeader;

