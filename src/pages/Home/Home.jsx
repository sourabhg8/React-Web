import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openLoginModal } from "../../store/slices/uiSlice";
import { selectIsAuthenticated, selectUser } from "../../store/slices/authSlice";
import { ROUTES, ROLES } from "../../utils/constants";
import styles from "./Home.module.css";

const FEATURES = [
  {
    title: "Hybrid AI Search",
    description:
      "Combine semantic vector search with full-text retrieval to surface the most relevant passages across millions of indexed chunks.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    title: "AI Research Summaries",
    description:
      "Get concise, evidence-grounded answers synthesized from top-ranked passages — so you grasp findings faster without reading every paper.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
        <path d="M8.5 10.5C6.57 10.06 5 8.36 5 6.25A4 4 0 0 1 9 2.26" />
        <path d="M15.5 10.5c1.93-.44 3.5-2.14 3.5-4.25A4 4 0 0 0 15 2.26" />
      </svg>
    ),
  },
  {
    title: "Multi-Source Corpus",
    description:
      "Literature indexed from PubMed, PMC, and other curated medical sources — normalized, chunked, and ready for enterprise search.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    title: "Subscription Access",
    description:
      "Organizations subscribe to unlock search, seat management, and role-based access for research teams and clinical workflows.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    step: "01",
    title: "Subscribe your organization",
    description: "Choose a plan that fits your team size and research volume.",
  },
  {
    step: "02",
    title: "Search across indexed literature",
    description: "Query by topic, filter by source and year, and explore ranked passages.",
  },
  {
    step: "03",
    title: "Review AI insights & sources",
    description: "Read featured summaries and jump to original publications with full metadata.",
  },
];

const PLANS = [
  {
    name: "Research",
    price: "$49",
    period: "/ seat / mo",
    description: "For individual researchers and small teams getting started.",
    features: ["Hybrid AI search", "Source & year filters", "AI summaries", "Up to 5 seats"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/ seat / mo",
    description: "For growing organizations with higher search volume.",
    features: [
      "Everything in Research",
      "Priority search performance",
      "Org admin & user management",
      "Up to 25 seats",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For institutions needing scale, compliance, and dedicated support.",
    features: [
      "Unlimited seats",
      "Custom source integrations",
      "SLA & dedicated support",
      "Advanced security controls",
    ],
    highlighted: false,
  },
];

const SOURCES = ["PubMed", "PMC", "Clinical Guidelines", "Peer-reviewed Journals"];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.home}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern} />
          <div className={styles.glowOrb} />
          <div className={styles.glowOrb2} />
        </div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Medical research intelligence platform
          </span>

          <h1 className={styles.heroTitle}>
            AI-powered search across
            <span className={styles.gradientText}> indexed medical literature</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Explore research from PubMed, PMC, and curated sources. Organizations
            subscribe for secure access to hybrid search, relevance-ranked results,
            and AI-generated summaries grounded in the evidence.
          </p>

          <div className={styles.heroCta}>
            <button type="button" className={styles.primaryBtn} onClick={handlePrimaryCta}>
              {canSearch ? "Open Research Search" : "Get Started"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => scrollTo("how-it-works")}>
              See how it works
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>1M+</span>
              <span className={styles.statLabel}>Indexed chunks</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>Multi</span>
              <span className={styles.statLabel}>Medical sources</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>AI</span>
              <span className={styles.statLabel}>Featured summaries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sources strip */}
      <section className={styles.sourcesStrip}>
        <div className={styles.sourcesInner}>
          <span className={styles.sourcesLabel}>Indexed from</span>
          <div className={styles.sourcesList}>
            {SOURCES.map((source) => (
              <span key={source} className={styles.sourcePill}>
                {source}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Platform capabilities</span>
            <h2 className={styles.sectionTitle}>
              Built for <span className={styles.gradientText}>clinical & research teams</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              From literature discovery to evidence synthesis — one subscription,
              one search experience across your organization&apos;s corpus.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>How it works</span>
            <h2 className={styles.sectionTitle}>From subscription to insight</h2>
          </div>

          <div className={styles.stepsGrid}>
            {STEPS.map((item) => (
              <div key={item.step} className={styles.stepCard}>
                <span className={styles.stepNumber}>{item.step}</span>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Subscriptions</span>
            <h2 className={styles.sectionTitle}>Plans for every research team</h2>
            <p className={styles.sectionSubtitle}>
              Organizations purchase seats. Researchers get full access to search and AI summaries.
            </p>
          </div>

          <div className={styles.plansGrid}>
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`${styles.planCard} ${plan.highlighted ? styles.planHighlighted : ""}`}
              >
                {plan.highlighted && <span className={styles.planBadge}>Most popular</span>}
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.planAmount}>{plan.price}</span>
                  {plan.period && <span className={styles.planPeriod}>{plan.period}</span>}
                </div>
                <p className={styles.planDesc}>{plan.description}</p>
                <ul className={styles.planFeatures}>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={plan.highlighted ? styles.planBtnPrimary : styles.planBtnSecondary}
                  onClick={handlePrimaryCta}
                >
                  {plan.name === "Enterprise" ? "Contact sales" : "Get started"}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to search the literature?</h2>
          <p className={styles.ctaText}>
            Sign in with your organization account or contact us to set up a subscription.
          </p>
          <button type="button" className={styles.primaryBtn} onClick={handlePrimaryCta}>
            {canSearch ? "Go to Research Search" : "Sign in to search"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
