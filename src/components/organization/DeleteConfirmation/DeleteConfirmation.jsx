import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../common';
import { organizationApi } from '../../../api/organizationApi';
import {
  deleteOrganizationSuccess,
  closeDeleteModal,
  setError,
  selectSelectedOrganization,
  selectOrganizationError,
} from '../../../store/slices/organizationSlice';
import styles from './DeleteConfirmation.module.css';

/**
 * Delete Confirmation Modal Content
 * Confirms organization deletion
 */
const DeleteConfirmation = () => {
  const dispatch = useDispatch();
  const selectedOrganization = useSelector(selectSelectedOrganization);
  const error = useSelector(selectOrganizationError);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedOrganization) return;

    setIsDeleting(true);

    try {
      await organizationApi.delete(selectedOrganization.id);
      dispatch(deleteOrganizationSuccess(selectedOrganization.id));
    } catch (err) {
      dispatch(setError(err.data?.message || err.message || 'Failed to delete organization'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeDeleteModal());
  };

  if (!selectedOrganization) return null;

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </div>

      <h3 className={styles.title}>Delete Organization</h3>

      <p className={styles.message}>
        Are you sure you want to delete <strong>{selectedOrganization.name}</strong>? 
        This action cannot be undone.
      </p>

      <div className={styles.orgInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Organization ID:</span>
          <span className={styles.infoValue}>{selectedOrganization.orgId}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{selectedOrganization.contact?.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status:</span>
          <span className={`${styles.status} ${styles[selectedOrganization.status]}`}>
            {selectedOrganization.status}
          </span>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.warning}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>All associated data will be permanently removed.</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader size="small" variant="dots" />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
              <span>Delete Organization</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;

