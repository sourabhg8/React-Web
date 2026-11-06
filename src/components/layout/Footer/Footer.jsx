import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { openLoginModal } from "../../../store/slices/uiSlice";
import { selectIsAuthenticated, selectUser } from "../../../store/slices/authSlice";
import { ROLES, ROUTES } from "../../../utils/constants";
import styles from "./Footer.module.css";

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const currentYear = new Date().getFullYear();

  const canSearch =
    isAuthenticated &&
    (user?.role === ROLES.ORG_USER || user?.role === "org_user");

  const handlePrimaryCta = () => {
    if (canSearch) {
      navigate(ROUTES.SEARCH);
      return;
    }
    dispatch(openLoginModal());
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.ctaWrap}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCopy}>
              <span className={styles.ctaEyebrow}>Research workspace</span>
              <h2 className={styles.ctaTitle}>Ready to search the literature?</h2>
              <p className={styles.ctaText}>
                Explore ADCs, antibodies, targets, payloads, and linkers with hybrid search,
                relevance-ranked passages, and AI summaries grounded in source papers.
              </p>
            </div>
            <button type="button" className={styles.ctaBtn} onClick={handlePrimaryCta}>
              {canSearch ? "Open research workspace" : "Sign in to get started"}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brand}>
              <Link to={ROUTES.HOME} className={styles.logo}>
                <img src="/logo.png" alt="TehriHills" className={styles.logoImg} />
              </Link>
              <p className={styles.tagline}>
                Medical research intelligence for teams who need trusted literature access,
                ranked results, and traceable AI insight.
              </p>
            </div>

            <nav className={styles.nav} aria-label="Footer">
              <div className={styles.navGroup}>
                <h3 className={styles.navTitle}>Platform</h3>
                <a href="/#features" className={styles.navLink}>
                  Capabilities
                </a>
                <a href="/#how-it-works" className={styles.navLink}>
                  How it works
                </a>
                <a href="/#accredited" className={styles.navLink}>
                  Accredited by
                </a>
              </div>

              <div className={styles.navGroup}>
                <h3 className={styles.navTitle}>Research</h3>
                <Link to={ROUTES.SEARCH} className={styles.navLink}>
                  Research workspace
                </Link>
                <span className={styles.navMuted}>PubMed & PMC indexed</span>
                <span className={styles.navMuted}>Evidence-grounded summaries</span>
              </div>

              <div className={styles.navGroup}>
                <h3 className={styles.navTitle}>Company</h3>
                <a href="#contact" className={styles.navLink}>
                  Contact
                </a>
                <a href="#privacy" className={styles.navLink}>
                  Privacy
                </a>
                <a href="#terms" className={styles.navLink}>
                  Terms
                </a>
              </div>
            </nav>
          </div>

          <div className={styles.bottom}>
            <p className={styles.copyright}>© {currentYear} TehriHills. All rights reserved.</p>
            <a href="/#accredited" className={styles.bottomLink}>
              HIPAA · GDPR · EPHMRA · Scientist.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
