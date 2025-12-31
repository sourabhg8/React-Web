import { useState } from 'react';
import { createPortal } from 'react-dom';
import { authApi } from '../../../api/apiClient';
import { Loader } from '../../common';
import styles from './ChangePasswordModal.module.css';

/**
 * Change Password Modal Component
 * Allows authenticated users to change their password
 */
const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Reset form when modal opens/closes
  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess(false);
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (error) setError('');

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authApi.changePassword(formData);
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Change Password</h2>
              <p className={styles.subtitle}>Update your account password</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {success ? (
            <div className={styles.successMessage}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3>Password Changed!</h3>
              <p>Your password has been updated successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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

              <div className={styles.inputGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  Current Password <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`${styles.input} ${validationErrors.currentPassword ? styles.inputError : ''}`}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                {validationErrors.currentPassword && (
                  <span className={styles.fieldError}>{validationErrors.currentPassword}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  New Password <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`${styles.input} ${validationErrors.newPassword ? styles.inputError : ''}`}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                {validationErrors.newPassword && (
                  <span className={styles.fieldError}>{validationErrors.newPassword}</span>
                )}
                <span className={styles.hint}>Minimum 6 characters</span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm New Password <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${styles.input} ${validationErrors.confirmPassword ? styles.inputError : ''}`}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                {validationErrors.confirmPassword && (
                  <span className={styles.fieldError}>{validationErrors.confirmPassword}</span>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader size="small" variant="dots" />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ChangePasswordModal;

