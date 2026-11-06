import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openLoginModal } from "../../store/slices/uiSlice";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../store/slices/authSlice";
import { ROUTES, ROLES } from "../../utils/constants";
import styles from "./Home.module.css";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const FEATURES = [
  {
    title: "Comprehensive Coverage",
    description:
      "Search across millions of indexed medical literature chunks from PubMed, PMC, Google Patents and curated sources.",
    tone: "green",
    index: "01",
    icon: (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <g className={styles.bookCovers}>
          <path d="M12 21V7" />
          <path d="M12 7a4 4 0 0 0-4-4H4v16a3 3 0 0 1 3-3h5" />
          <path d="M12 7a4 4 0 0 1 4-4h4v16a3 3 0 0 0-3-3h-5" />
        </g>
        <g className={styles.bookPages}>
          <path d="M7 10.5h4" />
          <path d="M7 13.5h3.5" />
          <path d="M7 16.5h4" />
          <path d="M13 10.5h4" />
          <path d="M13 13.5h3.5" />
          <path d="M13 16.5h4" />
        </g>
      </svg>
    ),
  },
  {
    title: "AI-Generated Summaries",
    description:
      "Get concise, evidence-grounded answers synthesized from top-ranked passages in seconds.",
    tone: "blue",
    index: "02",
    icon: (
      <svg {...iconProps}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        <text
          x="12"
          y="13.5"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="5.5"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          AI
        </text>
      </svg>
    ),
  },
  {
    title: "Relevance-Ranked Results",
    description:
      "Hybrid semantic and keyword search surfaces the most relevant passages for your query.",
    tone: "purple",
    index: "03",
    icon: (
      <svg {...iconProps}>
        <path d="M3 20V4" />
        <path d="M3 20h18" />
        <path d="M8 20V15" />
        <path d="M12 20V10" />
        <path d="M16 20V5" />
      </svg>
    ),
  },
  {
    title: "Secure & Enterprise Ready",
    description:
      "Role-based access, compliance-ready infrastructure, and organization-level administration.",
    tone: "orange",
    index: "04",
    icon: (
      <svg {...iconProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="11" width="6" height="5" rx="1" />
        <path d="M11 11V9.5a1 1 0 0 1 2 0V11" />
        <path d="M12 14v1" />
      </svg>
    ),
  },
];

const STATS = [
  {
    value: "1M+",
    label: "Indexed chunks",
    accent: "green",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    value: "Multi",
    label: "Medical sources",
    accent: "blue",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    value: "AI",
    label: "Powered search",
    accent: "violet",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    value: "Trusted",
    label: "By research teams",
    accent: "amber",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const LEADING_SOURCES = [
  { name: "PubMed", abbr: "PM", tone: "teal" },
  { name: "PMC", abbr: "PMC", tone: "blue" },
  { name: "ClinicalTrials.gov", abbr: "CT", tone: "violet" },
  { name: "Google Patents", abbr: "GP", tone: "amber" },
];

const WORKFLOW_STEPS = [
  {
    id: "access",
    phase: "Access",
    title: "Sign in with your credentials",
    description:
      "Use your organization username and password to enter a secure, role-based workspace.",
    tone: "blue",
    icon: (
      <svg {...iconProps}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "discover",
    phase: "Discover",
    title: "Search indexed literature",
    description:
      "Query by topic, filter by source and year, and explore ranked passages from PubMed, PMC, and more.",
    tone: "green",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    id: "understand",
    phase: "Understand",
    title: "Review AI insights & sources",
    description:
      "Read evidence-grounded summaries and open original publications with full citation metadata.",
    tone: "violet",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3z" />
        <path d="M12 12 3 7.5M12 12l9-4.5M12 12v9" />
      </svg>
    ),
  },
];

const ACCREDITATION = [
  {
    src: "/accreditation/scientist-com.png",
    alt: "Scientist.com registered supplier",
    label: "Scientist.com",
    detail: "Registered supplier",
    tone: "blue",
    darkPlate: false,
  },
  {
    src: "/accreditation/ephmra.png",
    alt: "EPHMRA Agency Member",
    label: "EPHMRA",
    detail: "Pharmaceutical market research",
    tone: "amber",
  },
  {
    src: "/accreditation/hipaa.png",
    alt: "HIPAA Compliant",
    label: "HIPAA",
    detail: "Healthcare data safeguards",
    tone: "green",
  },
  {
    src: "/accreditation/iso-9001-27001.png",
    alt: "ISO 9001:2015 and ISO 27001:2013 certified",
    label: "ISO 9001-27001",
    detail: "Quality & information security",
    tone: "blue",
    darkPlate: false,
    wideLogo: true,
  },
  {
    src: "/accreditation/gdpr.png",
    alt: "EU GDPR Compliant",
    label: "EU GDPR",
    detail: "Privacy & data protection",
    tone: "blue",
  },
];

const WORKFLOW_DEMO_QUERY = "ADC payload linker stability";
const WORKFLOW_DEMO_USERNAME = "analyst@organization.com";
const WORKFLOW_DEMO_PASSWORD_LEN = 8;
const WORKFLOW_AI_SUMMARY =
  "Linker stability relates to payload release and tolerability in recent ADC studies.";
const WORKFLOW_RANKED_RESULTS = [
  { title: "Payload-linker design in antibody–drug conjugates", relevance: 98 },
  { title: "Stability of cleavable ADC linkers in vivo", relevance: 94 },
  { title: "Clinical tolerability of next-gen conjugates", relevance: 89 },
];

const WorkflowSecureAccessDemo = () => {
  const [phase, setPhase] = useState("credentials");
  const [usernameLength, setUsernameLength] = useState(0);
  const [passwordLength, setPasswordLength] = useState(0);
  const [focusedField, setFocusedField] = useState("username");

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setPhase("unlocked");
      setUsernameLength(WORKFLOW_DEMO_USERNAME.length);
      setPasswordLength(WORKFLOW_DEMO_PASSWORD_LEN);
      return undefined;
    }

    let cancelled = false;
    const timeouts = [];

    const schedule = (fn, ms) => {
      const id = window.setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const runCycle = () => {
      if (cancelled) return;

      setPhase("credentials");
      setUsernameLength(0);
      setPasswordLength(0);
      setFocusedField("username");

      let userIndex = 0;
      const typeUsername = () => {
        if (cancelled) return;
        userIndex += 1;
        setUsernameLength(userIndex);
        if (userIndex < WORKFLOW_DEMO_USERNAME.length) {
          schedule(typeUsername, 52);
          return;
        }
        schedule(() => {
          if (cancelled) return;
          setFocusedField("password");
          let passIndex = 0;
          const typePassword = () => {
            if (cancelled) return;
            passIndex += 1;
            setPasswordLength(passIndex);
            if (passIndex < WORKFLOW_DEMO_PASSWORD_LEN) {
              schedule(typePassword, 78);
              return;
            }
            schedule(() => {
              if (cancelled) return;
              setPhase("signing");
              setFocusedField(null);
              schedule(() => {
                if (cancelled) return;
                setPhase("unlocked");
                schedule(runCycle, 2800);
              }, 1400);
            }, 450);
          };
          schedule(typePassword, 320);
        }, 380);
      };

      schedule(typeUsername, 650);
    };

    schedule(runCycle, 500);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const isSigning = phase === "signing";
  const isUnlocked = phase === "unlocked";
  const isCredentials = phase === "credentials";

  return (
    <>
      <div className={styles.workflowPreviewHead}>
        <div
          className={[
            styles.workflowPreviewIcon,
            styles.workflowPreviewIcon_blue,
            isUnlocked ? styles.workflowPreviewIcon_unlocked : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {WORKFLOW_STEPS[0].icon}
        </div>
        <span className={styles.workflowPreviewLabel}>Sign in</span>
      </div>

      <div className={styles.workflowPreviewMain}>
        {isUnlocked ? (
          <div
            className={`${styles.workflowAccessField} ${styles.workflowAccessField_unlocked}`}
          >
            <span className={styles.workflowAccessGranted}>
              Signed in as {WORKFLOW_DEMO_USERNAME}
            </span>
          </div>
        ) : (
          <div className={styles.workflowLoginForm}>
            <label className={styles.workflowLoginLabel}>
              Username
              <span
                className={[
                  styles.workflowAccessField,
                  styles.workflowAccessField_username,
                  focusedField === "username"
                    ? styles.workflowAccessField_focus
                    : "",
                  isSigning ? styles.workflowAccessField_busy : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {WORKFLOW_DEMO_USERNAME.slice(0, usernameLength)}
                {isCredentials && focusedField === "username" && (
                  <span className={styles.workflowPreviewCaret} aria-hidden />
                )}
              </span>
            </label>
            <label className={styles.workflowLoginLabel}>
              Password
              <span
                className={[
                  styles.workflowAccessField,
                  styles.workflowAccessField_password,
                  focusedField === "password"
                    ? styles.workflowAccessField_focus
                    : "",
                  isSigning ? styles.workflowAccessField_busy : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className={styles.workflowPasswordMask} aria-hidden>
                  {"•".repeat(passwordLength)}
                </span>
                {isCredentials && focusedField === "password" && (
                  <span className={styles.workflowPreviewCaret} aria-hidden />
                )}
              </span>
            </label>
          </div>
        )}
      </div>

      <div className={styles.workflowPreviewActions}>
        <span
          className={[
            styles.workflowAccessBtn,
            isSigning ? styles.workflowAccessBtn_loading : "",
            isUnlocked ? styles.workflowAccessBtn_done : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isUnlocked ? (
            <>
              <span className={styles.workflowAccessBtnCheck} aria-hidden>
                ✓
              </span>
              Access granted
            </>
          ) : isSigning ? (
            "Signing in…"
          ) : (
            "Sign in"
          )}
        </span>
      </div>

      <div className={styles.workflowPreviewFoot}>
        <span
          className={[
            styles.workflowPreviewChip,
            isUnlocked ? styles.workflowPreviewChip_live : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isUnlocked ? "Encrypted session · Active" : "Username & password"}
        </span>
      </div>
    </>
  );
};

const WorkflowQueryTyping = ({ text, className, caretClassName }) => {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setVisibleLength(text.length);
      return undefined;
    }

    let cancelled = false;
    let timeoutId;

    const runCycle = () => {
      let index = 0;
      setVisibleLength(0);

      const typeNext = () => {
        if (cancelled) return;
        index += 1;
        setVisibleLength(index);
        if (index < text.length) {
          timeoutId = window.setTimeout(typeNext, 58);
          return;
        }
        timeoutId = window.setTimeout(() => {
          if (!cancelled) runCycle();
        }, 2600);
      };

      timeoutId = window.setTimeout(typeNext, 700);
    };

    runCycle();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <span className={className}>
      {text.slice(0, visibleLength)}
      <span className={caretClassName} aria-hidden />
    </span>
  );
};

const WorkflowInsightDemo = () => {
  const [phase, setPhase] = useState("generating");
  const [summaryLength, setSummaryLength] = useState(0);
  const [visibleResults, setVisibleResults] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setPhase("results");
      setSummaryLength(WORKFLOW_AI_SUMMARY.length);
      setVisibleResults(WORKFLOW_RANKED_RESULTS.length);
      return undefined;
    }

    let cancelled = false;
    const timeouts = [];

    const schedule = (fn, ms) => {
      const id = window.setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const revealResults = (count) => {
      if (cancelled) return;
      if (count > WORKFLOW_RANKED_RESULTS.length) {
        schedule(() => {
          if (!cancelled) runCycle();
        }, 2800);
        return;
      }
      setVisibleResults(count);
      schedule(() => revealResults(count + 1), 420);
    };

    const typeSummary = (index) => {
      if (cancelled) return;
      const next = index + 1;
      setSummaryLength(next);
      if (next < WORKFLOW_AI_SUMMARY.length) {
        schedule(() => typeSummary(next), 36);
        return;
      }
      schedule(() => {
        if (cancelled) return;
        setPhase("results");
        setVisibleResults(0);
        schedule(() => revealResults(1), 320);
      }, 480);
    };

    const runCycle = () => {
      if (cancelled) return;
      setPhase("generating");
      setSummaryLength(0);
      setVisibleResults(0);
      schedule(() => {
        if (cancelled) return;
        setPhase("summary");
        schedule(() => typeSummary(0), 200);
      }, 1100);
    };

    schedule(runCycle, 900);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const isGenerating = phase === "generating";
  const isSummary = phase === "summary";
  const isResults = phase === "results";

  return (
    <>
      <div className={styles.workflowPreviewHead}>
        <div
          className={[
            styles.workflowPreviewIcon,
            styles.workflowPreviewIcon_violet,
            isResults ? styles.workflowPreviewIcon_unlocked : "",
            isGenerating ? styles.workflowPreviewIcon_aiBusy : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {WORKFLOW_STEPS[2].icon}
        </div>
        <span className={styles.workflowPreviewLabel}>AI summary</span>
      </div>

      <div className={styles.workflowPreviewMain}>
        <div
          className={[
            styles.workflowInsightSummary,
            isGenerating ? styles.workflowInsightSummary_loading : "",
            isResults ? styles.workflowInsightSummary_ready : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isGenerating ? (
            <div className={styles.workflowInsightSkeleton} aria-hidden>
              <span />
              <span />
              <span />
            </div>
          ) : (
            <>
              <span className={styles.workflowInsightAiTag}>AI</span>
              <p className={styles.workflowInsightSummaryText}>
                {WORKFLOW_AI_SUMMARY.slice(0, summaryLength)}
                {isSummary && (
                  <span className={styles.workflowPreviewCaret} aria-hidden />
                )}
              </p>
            </>
          )}
        </div>

        <div className={styles.workflowInsightResultsWrap}>
          <span className={styles.workflowInsightResultsLabel}>
            {isGenerating || isSummary
              ? "Preparing ranked passages…"
              : "Ranked by relevance"}
          </span>
          <ul className={styles.workflowInsightResults}>
            {WORKFLOW_RANKED_RESULTS.map((item, index) => (
              <li
                key={item.title}
                className={[
                  styles.workflowInsightResult,
                  index < visibleResults
                    ? styles.workflowInsightResult_visible
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className={styles.workflowInsightRank}>{index + 1}</span>
                <span className={styles.workflowInsightTitle}>
                  {item.title}
                </span>
                <span className={styles.workflowInsightScore}>
                  {item.relevance}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.workflowPreviewActions} aria-hidden />

      <div className={styles.workflowPreviewFoot}>
        <span
          className={[
            styles.workflowPreviewChip,
            styles.workflowPreviewChip_insight,
            isResults && visibleResults >= WORKFLOW_RANKED_RESULTS.length
              ? styles.workflowPreviewChip_live
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isResults && visibleResults >= WORKFLOW_RANKED_RESULTS.length
            ? "PMID · sources linked"
            : "Evidence-grounded"}
        </span>
      </div>
    </>
  );
};

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
      <section className={styles.hero} aria-label="Platform overview">
        <div className={styles.heroOverlay} aria-hidden />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.badge}>Medical research intelligence</p>

            <h1 className={styles.heroTitle}>
              AI-powered search across{" "}
              <span className={styles.heroTitleAccent}>
                indexed medical literature
              </span>
            </h1>

            <p className={styles.heroSubtitle}>
              PubMed, PMC, and Google Patents with hybrid search, ranked
              results, and evidence-grounded AI summaries.
            </p>

            <div className={styles.heroCta}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handlePrimaryCta}
              >
                {canSearch ? "Open research workspace" : "Get started"}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => scrollTo("how-it-works")}
              >
                See how it works
              </button>
            </div>
            {!canSearch && (
              <p className={styles.heroCtaNote}>
                Sign in with your organization account
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.platform} id="features">
        <div className={styles.sectionContainer}>
          <header className={styles.platformHeader}>
            <h2 className={styles.platformHeading}>
              Built for rigorous medical research
            </h2>
            <p className={styles.platformLead}>
              Hybrid search, ranked evidence, and AI summaries in one workspace.
            </p>
          </header>

          <div className={styles.platformCard}>
            <div className={styles.featuresGrid}>
              {FEATURES.map((feature) => (
                <article
                  key={feature.title}
                  className={`${styles.featureCard} ${styles[`featureCard_${feature.tone}`]}`}
                >
                  <span className={styles.featureIndex} aria-hidden>
                    {feature.index}
                  </span>
                  <div
                    className={`${styles.featureIcon} ${styles[`featureIcon_${feature.tone}`]}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.description}</p>
                </article>
              ))}
            </div>

            <div className={styles.statsBand} aria-label="Platform at a glance">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={`${styles.statItem} ${styles[`statItem_${stat.accent}`]}`}
                >
                  <span className={styles.statIcon}>{stat.icon}</span>
                  <div className={styles.statCopy}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.sourcesBlock}>
              <div className={styles.sourcesIntro}>
                <h3 className={styles.sourcesHeading}>
                  Search across leading sources
                </h3>
                <p className={styles.sourcesSub}>
                  Unified hybrid search over peer-reviewed and curated medical
                  indexes.
                </p>
              </div>
              <div className={styles.sourcesGrid}>
                {LEADING_SOURCES.map((source) => (
                  <div
                    key={source.name}
                    className={`${styles.sourceCard} ${styles[`sourceCard_${source.tone}`]}`}
                  >
                    <span className={styles.sourceMark} aria-hidden>
                      {source.abbr}
                    </span>
                    <div className={styles.sourceMeta}>
                      <span className={styles.sourceName}>{source.name}</span>
                      <span className={styles.sourceTag}>Indexed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.accredited} id="accredited">
        <div className={styles.sectionContainer}>
          <header className={styles.accreditedHeader}>
            <h2 className={styles.accreditedHeading}>Accredited by</h2>
            <p className={styles.accreditedLead}>
              Independent recognition for security, privacy, and professional
              standards.
            </p>
          </header>

          <div className={styles.accreditedCard}>
            <div className={styles.accreditedGrid}>
              {ACCREDITATION.map((item) => (
                <figure
                  key={item.label}
                  className={[
                    styles.accreditedItem,
                    styles[`accreditedItem_${item.tone}`],
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div
                    className={[
                      styles.accreditedLogoPlate,
                      item.darkPlate ? styles.accreditedLogoPlate_dark : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className={[
                        styles.accreditedLogo,
                        item.wideLogo ? styles.accreditedLogo_wide : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      loading="lazy"
                    />
                  </div>
                  <figcaption className={styles.accreditedCaption}>
                    <span className={styles.accreditedLabel}>{item.label}</span>
                    <span className={styles.accreditedDetail}>
                      {item.detail}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.workflow}
        id="how-it-works"
        aria-labelledby="workflow-heading"
      >
        <div className={styles.sectionContainer}>
          <header className={styles.workflowHeader}>
            <p className={styles.workflowEyebrow}>How it works</p>
            <h2 className={styles.workflowHeading} id="workflow-heading">
              From question to evidence
            </h2>
            <p className={styles.workflowLead}>
              Three connected stages — secure access, intelligent search, and
              traceable answers backed by source literature.
            </p>
          </header>

          <div className={styles.workflowCard}>
            <div className={styles.workflowRailBar} aria-hidden>
              <div className={styles.workflowRailTrack}>
                <span
                  className={`${styles.workflowRailDot} ${styles.workflowRailDot_accessToSearch}`}
                />
                <span
                  className={`${styles.workflowRailDot} ${styles.workflowRailDot_searchToResults}`}
                />
              </div>
              {WORKFLOW_STEPS.map((item) => (
                <div key={item.id} className={styles.workflowRailCol}>
                  <div
                    className={`${styles.workflowNode} ${styles[`workflowNode_${item.tone}`]}`}
                  >
                    <span className={styles.workflowNodeIcon}>{item.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <ol className={styles.workflowStages}>
              {WORKFLOW_STEPS.map((item) => (
                <li key={item.id} className={styles.workflowColumn}>
                  <article
                    className={`${styles.workflowStage} ${styles[`workflowStage_${item.tone}`]}`}
                  >
                    <span className={styles.workflowPhase}>{item.phase}</span>
                    <h3 className={styles.workflowStageTitle}>{item.title}</h3>
                    <p className={styles.workflowStageDesc}>
                      {item.description}
                    </p>
                  </article>
                </li>
              ))}
            </ol>

            <div className={styles.workflowPreview} aria-hidden>
              <div
                className={[
                  styles.workflowPreviewPanel,
                  styles.workflowPreviewPanel_access,
                ].join(" ")}
              >
                <WorkflowSecureAccessDemo />
              </div>
              <div
                className={[
                  styles.workflowPreviewPanel,
                  styles.workflowPreviewPanel_query,
                  styles.workflowPreviewPanel_active,
                ].join(" ")}
              >
                <div className={styles.workflowPreviewHead}>
                  <div
                    className={`${styles.workflowPreviewIcon} ${styles.workflowPreviewIcon_green}`}
                  >
                    {WORKFLOW_STEPS[1].icon}
                  </div>
                  <span className={styles.workflowPreviewLabel}>Query</span>
                </div>
                <div className={styles.workflowPreviewMain}>
                  <WorkflowQueryTyping
                    text={WORKFLOW_DEMO_QUERY}
                    className={styles.workflowPreviewSearch}
                    caretClassName={styles.workflowPreviewCaret}
                  />
                </div>
                <div className={styles.workflowPreviewActions}>
                  <span className={styles.workflowPreviewFilters}>
                    <span>PubMed</span>
                    <span>2020–2026</span>
                  </span>
                </div>
                <div className={styles.workflowPreviewFoot}>
                  <span className={styles.workflowPreviewChip}>
                    Hybrid · ranked
                  </span>
                </div>
              </div>
              <div
                className={[
                  styles.workflowPreviewPanel,
                  styles.workflowPreviewPanel_insight,
                ].join(" ")}
              >
                <WorkflowInsightDemo />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
