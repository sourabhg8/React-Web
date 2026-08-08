import Modal from '../../common/Modal/Modal';
import styles from './DocumentAdcInfoModal.module.css';

const getField = (data, key) => {
  if (!data) return '';
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  return (data[key] ?? data[pascal] ?? '').trim();
};

const FIELD_ROWS = [
  { key: 'adcName', label: 'ADC Name' },
  { key: 'antibodyName', label: 'Antibody Name' },
  { key: 'payloadName', label: 'Payload Name' },
  { key: 'linkerName', label: 'Linker Name' },
];

/**
 * Modal showing ADC summary and structured fields for a document.
 */
const DocumentAdcInfoModal = ({
  isOpen,
  onClose,
  documentTitle,
  isLoading,
  error,
  data,
}) => {
  const summary = getField(data, 'summary');
  const title = documentTitle || getField(data, 'documentTitle') || 'Document details';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Document Summary"
      size="medium"
    >
      <div className={styles.container}>
        <p className={styles.documentTitle}>{title}</p>

        {isLoading && (
          <div className={styles.loadingState}>
            <span className={styles.spinner} aria-hidden />
            <p>Generating AI summary...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.errorState} role="alert">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {summary && (
              <section className={styles.summarySection}>
                <h3 className={styles.sectionTitle}>Summary</h3>
                <p className={styles.summaryText}>{summary}</p>
              </section>
            )}

            <section className={styles.fieldsSection}>
              <h3 className={styles.sectionTitle}>Details</h3>
              <dl className={styles.fieldList}>
                {FIELD_ROWS.map(({ key, label }) => (
                  <div key={key} className={styles.fieldRow}>
                    <dt className={styles.fieldLabel}>{label}</dt>
                    <dd className={styles.fieldValue}>{getField(data, key) || '\u00A0'}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DocumentAdcInfoModal;
