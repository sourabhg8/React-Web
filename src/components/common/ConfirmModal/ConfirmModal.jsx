import Modal from '../Modal/Modal';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
    <div className={styles.content}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={variant === 'danger' ? styles.confirmBtnDanger : styles.confirmBtn}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
