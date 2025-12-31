import styles from './StatsGrid.module.css';

/**
 * StatCard Component
 * Individual stat card within the grid
 */
export const StatCard = ({ icon, value, label, variant = 'default' }) => {
  const iconClass = variant !== 'default' ? styles[`statIcon${variant.charAt(0).toUpperCase() + variant.slice(1)}`] : '';
  
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${iconClass}`}>
        {icon}
      </div>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

/**
 * StatsGrid Component
 * Grid container for stat cards
 */
const StatsGrid = ({ children, columns = 3 }) => {
  return (
    <div 
      className={styles.statsGrid} 
      style={{ '--columns': columns }}
    >
      {children}
    </div>
  );
};

export default StatsGrid;

