import { useDispatch } from "react-redux";
import { openLoginModal } from "../../store/slices/uiSlice";
import styles from "./Home.module.css";

const Home = () => {
  const dispatch = useDispatch();

  const handleGetStarted = () => {
    dispatch(openLoginModal());
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.glowOrb}></div>
          <div className={styles.glowOrb2}></div>
        </div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Welcome to TehriHills
          </span>

          <h1 className={styles.heroTitle}>
            Discover the Beauty of
            <span className={styles.gradientText}> the Hills</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Experience the serene landscapes, rich culture, and breathtaking
            views of Tehri. Your gateway to exploring the majestic Himalayan
            foothills awaits.
          </p>

          <div className={styles.heroCta}>
            <button className={styles.primaryBtn} onClick={handleGetStarted}>
              Get Started
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className={styles.secondaryBtn}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Watch Video
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>10K+</span>
              <span className={styles.statLabel}>Visitors</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Destinations</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statValue}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>
            Why Choose <span className={styles.gradientText}>TehriHills</span>
          </h2>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Curated Experiences</h3>
              <p className={styles.featureDesc}>
                Handpicked destinations and experiences that showcase the best
                of Tehri&apos;s natural beauty and cultural heritage.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Secure Platform</h3>
              <p className={styles.featureDesc}>
                Enterprise-grade security with role-based access ensuring your
                data and bookings are always protected.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Access Anywhere</h3>
              <p className={styles.featureDesc}>
                Fully responsive design that works beautifully on any device.
                Plan your trip on the go, anytime, anywhere.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Real-time Updates</h3>
              <p className={styles.featureDesc}>
                Stay informed with live updates on weather, availability, and
                local events in the Tehri region.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
