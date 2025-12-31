import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../common';
import { userApi } from '../../../api/userApi';
import {
  deleteUserSuccess,
  closeDeleteModal,
  setError,
  selectSelectedUser,
  selectUserError,
} from '../../../store/slices/userSlice';
import styles from './UserDeleteConfirmation.module.css';

/**
 * User Delete Confirmation Modal Content
 */
const UserDeleteConfirmation = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectSelectedUser);
  const error = useSelector(selectUserError);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);

    try {
      await userApi.delete(selectedUser.id);
      dispatch(deleteUserSuccess(selectedUser.id));
    } catch (err) {
      dispatch(setError(err.data?.message || err.message || 'Failed to delete user'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeDeleteModal());
  };

  if (!selectedUser) return null;

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="13" />
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      </div>

      <h3 className={styles.title}>Delete User</h3>

      <p className={styles.message}>
        Are you sure you want to delete <strong>{selectedUser.name}</strong>? 
        This action cannot be undone.
      </p>

      <div className={styles.userInfo}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{selectedUser.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Organization:</span>
          <span className={styles.infoValue}>{selectedUser.orgName}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Role:</span>
          <span className={`${styles.role} ${styles[selectedUser.userType]}`}>
            {selectedUser.userType === 'org_admin' ? 'Org Admin' : 'User'}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Status:</span>
          <span className={`${styles.status} ${styles[selectedUser.status]}`}>
            {selectedUser.status}
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
              <span>Delete User</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserDeleteConfirmation;

