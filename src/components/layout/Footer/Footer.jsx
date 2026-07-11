import { Link } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link to={ROUTES.HOME} className={styles.logo}>
              <img src="/logo.png" alt="TehriHills" className={styles.logoImg} />
            </Link>
            <p className={styles.tagline}>
              AI-powered search across indexed medical research. Subscription access
              for organizations and research teams.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Product</h4>
              <a href="/#features" className={styles.link}>
                Features
              </a>
              <a href="/#how-it-works" className={styles.link}>
                How it works
              </a>
              <a href="/#pricing" className={styles.link}>
                Subscriptions
              </a>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Research</h4>
              <Link to={ROUTES.SEARCH} className={styles.link}>
                Literature search
              </Link>
              <span className={styles.linkMuted}>PubMed & PMC indexed</span>
              <span className={styles.linkMuted}>AI summaries</span>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Legal</h4>
              <a href="#privacy" className={styles.link}>
                Privacy
              </a>
              <a href="#terms" className={styles.link}>
                Terms
              </a>
              <a href="#contact" className={styles.link}>
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} TehriHills. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
