import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import styles from './OrgAdmin.module.css';

/**
 * Org Admin Dashboard Page
 * Accessible only to OrgAdmin users
 * Placeholder for future implementation
 */
const OrgAdmin = () => {
  const user = useSelector(selectUser);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Organisation Admin</span>
          <h1 className={styles.title}>Organisation Dashboard</h1>
          <p className={styles.subtitle}>
            Manage your organisation settings and users
          </p>
        </div>

        <div className={styles.orgInfo}>
          <div className={styles.orgIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
              <path d="M19 21H5" />
              <path d="M9 7h6" />
              <path d="M9 11h6" />
              <path d="M9 15h4" />
            </svg>
          </div>
          <div className={styles.orgDetails}>
            <span className={styles.orgId}>{user?.organisationId || 'N/A'}</span>
            <span className={styles.orgTier}>{user?.organisationTier || 'Standard'} Tier</span>
          </div>
        </div>

        <div className={styles.welcomeCard}>
          <div className={styles.welcomeContent}>
            <h2 className={styles.welcomeTitle}>
              Welcome back!
            </h2>
            <p className={styles.welcomeText}>
              Your organisation admin dashboard is ready. Start managing your 
              team, configure settings, and monitor activity.
            </p>
          </div>
        </div>

        <div className={styles.actionsGrid}>
          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className={styles.actionTitle}>Manage Users</span>
            <span className={styles.actionDesc}>Add, edit or remove users</span>
          </button>

          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span className={styles.actionTitle}>Settings</span>
            <span className={styles.actionDesc}>Configure organisation</span>
          </button>

          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <span className={styles.actionTitle}>Reports</span>
            <span className={styles.actionDesc}>View activity reports</span>
          </button>

          <button className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className={styles.actionTitle}>Security</span>
            <span className={styles.actionDesc}>Manage access & roles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgAdmin;

