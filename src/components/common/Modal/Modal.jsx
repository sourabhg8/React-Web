import { useEffect, useCallback } from 'react';
import Portal from '../Portal/Portal';
import styles from './Modal.module.css';

/**
 * Generic Modal component using Portal
 * Can render any content passed as children
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Callback when modal should close
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Optional modal title
 * @param {string} props.size - Modal size: 'small', 'medium', 'large', 'fullscreen'
 * @param {boolean} props.showCloseButton - Whether to show close button (default: true)
 * @param {boolean} props.closeOnOverlayClick - Close when clicking overlay (default: true)
 * @param {boolean} props.closeOnEsc - Close on Escape key (default: true)
 * @param {string} props.className - Additional class for modal content
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
}) => {
  // Handle Escape key press
  const handleKeyDown = useCallback(
    (event) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Add/remove event listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Portal containerId="modal-root">
      <div 
        className={styles.overlay}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div 
          className={`${styles.modal} ${styles[size]} ${className}`}
          role="document"
        >
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && (
                <h2 id="modal-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;

