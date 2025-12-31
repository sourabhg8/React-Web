import styles from './Loader.module.css';

/**
 * Pure CSS Loader component
 * 
 * @param {object} props
 * @param {string} props.size - Size of loader: 'small', 'medium', 'large'
 * @param {boolean} props.fullScreen - Whether to show as fullscreen overlay
 * @param {string} props.text - Optional loading text
 * @param {string} props.variant - Loader variant: 'spinner', 'dots', 'pulse'
 */
const Loader = ({ 
  size = 'medium', 
  fullScreen = false, 
  text = '', 
  variant = 'spinner' 
}) => {
  const loaderContent = (
    <div className={`${styles.loaderContainer} ${styles[size]}`}>
      {variant === 'spinner' && (
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerCore}></div>
        </div>
      )}
      
      {variant === 'dots' && (
        <div className={styles.dots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      )}
      
      {variant === 'pulse' && (
        <div className={styles.pulse}>
          <div className={styles.pulseRing}></div>
          <div className={styles.pulseRing}></div>
          <div className={styles.pulseRing}></div>
        </div>
      )}
      
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;

