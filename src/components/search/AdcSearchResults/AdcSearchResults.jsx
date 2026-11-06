import { useMemo, useState, useRef, useEffect } from 'react';
import { formatRelevancePercent } from '../../../utils/formatRelevance';
import { AdcSourceIcon, getAdcSourceMeta } from './adcSourceIcons';
import styles from './AdcSearchResults.module.css';

const ALL_SOURCES = 'All';
const DRUG_STATUS_FACET = 'drugStatus';
const DRUG_STATUS_LABEL = 'Drug status';

/** Order and labels for expanded row details (matches API AdcSearchDetailsDto). */
const ADC_DETAIL_FIELDS = [
  { key: 'name', label: 'Name', fullWidth: true },
  { key: 'aliases', label: 'Aliases', fullWidth: true },
  { key: 'normalizedAliases', label: 'Normalized aliases', fullWidth: true },
  { key: 'antibody', label: 'Antibody' },
  { key: 'targets', label: 'Targets', fullWidth: true },
  { key: 'linkerCode', label: 'Linker code' },
  { key: 'linkerType', label: 'Linker type' },
  { key: 'linkerSequence', label: 'Linker sequence', fullWidth: true },
  { key: 'payload', label: 'Payload' },
  { key: 'payloadClass', label: 'Payload class' },
  { key: 'therapeuticTarget', label: 'Therapeutic target' },
  { key: 'dar', label: 'DAR' },
  { key: 'developers', label: 'Developers', fullWidth: true },
  { key: 'clinicalPhase', label: 'Clinical phase' },
  { key: 'drugStatus', label: 'Drug status' },
  { key: 'approvalStatus', label: 'Approval status' },
  { key: 'approvalCountry', label: 'Approval country' },
  { key: 'approvalDate', label: 'Approval date' },
  { key: 'indications', label: 'Indications', fullWidth: true },
  { key: 'trialIds', label: 'Trial IDs', fullWidth: true },
  { key: 'publicationReference', label: 'Publication / reference', fullWidth: true },
  { key: 'source', label: 'Source' },
  { key: 'sourceUrl', label: 'Source URL', fullWidth: true, isLink: true },
  { key: 'verificationTier', label: 'Verification tier' },
  { key: 'validationDate', label: 'Validation date' },
  { key: 'validationNote', label: 'Validation note', fullWidth: true },
];

function parseSourceFacets(facetCounts, totalResults) {
  const counts = {};
  if (!facetCounts) {
    counts[ALL_SOURCES] = totalResults ?? 0;
    return counts;
  }

  for (const [key, count] of Object.entries(facetCounts)) {
    const colon = key.indexOf(':');
    if (colon === -1) continue;
    const field = key.slice(0, colon);
    const value = key.slice(colon + 1);
    if (field === 'sourceType') {
      counts[value] = count;
    }
  }
  if (counts[ALL_SOURCES] == null) {
    counts[ALL_SOURCES] = totalResults ?? 0;
  }
  return counts;
}

function parseDrugStatusFacets(facetCounts) {
  const out = {};
  if (!facetCounts) return out;
  const prefix = `${DRUG_STATUS_FACET}:`;
  for (const [key, count] of Object.entries(facetCounts)) {
    if (key.startsWith(prefix)) {
      out[key.slice(prefix.length)] = count;
    }
  }
  return out;
}

/** Options for the dropdown: union of facet values and currently selected (same idea as source tabs). */
function buildDrugStatusOptions(counts, selected) {
  const values = new Set([...Object.keys(counts), ...selected]);
  return Array.from(values)
    .filter((v) => v !== '')
    .map((value) => ({
      value,
      count: counts[value] ?? 0,
    }))
    .sort((a, b) => a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }));
}

const AdcSearchResults = ({
  searchResponse,
  isLoading,
  error,
  selectedSource,
  onSourceFilter,
  selectedDrugStatuses = [],
  onDrugStatusFilter,
  onPageChange,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const totalResults = searchResponse?.totalResults ?? 0;
  const facetCounts = searchResponse?.facetCounts ?? {};

  const sourceCounts = useMemo(
    () => parseSourceFacets(facetCounts, totalResults),
    [facetCounts, totalResults]
  );

  const drugStatusCounts = useMemo(() => parseDrugStatusFacets(facetCounts), [facetCounts]);

  const drugStatusOptions = useMemo(
    () => buildDrugStatusOptions(drugStatusCounts, selectedDrugStatuses),
    [drugStatusCounts, selectedDrugStatuses]
  );

  const sourceTabs = useMemo(() => {
    const types = [ALL_SOURCES, 'ADC', 'Antibody', 'Payload', 'Linker', 'Other'];
    return types
      .filter((t) => t === ALL_SOURCES || (sourceCounts[t] ?? 0) > 0 || selectedSource === t)
      .map((t) => ({
        value: t,
        count: sourceCounts[t] ?? (t === ALL_SOURCES ? totalResults : 0),
      }));
  }, [sourceCounts, totalResults, selectedSource]);

  if (isLoading) {
    return (
      <div className={styles.stateBox}>
        <div className={styles.spinner} />
        <p>Searching ADC catalog…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateBox}>
        <h3>Search error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!searchResponse) {
    return (
      <div className={styles.stateBox}>
        <h3>ADC search</h3>
        <p>Search ADCs, antibodies, payloads, linkers, and related records.</p>
      </div>
    );
  }

  const {
    results = [],
    pageNumber = 1,
    totalPages = 1,
    sanitizedQuery = '',
    searchTimeMs = 0,
  } = searchResponse;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const drugStatusBreadcrumbs = selectedDrugStatuses.map((value) => ({
    value,
    label: value,
  }));

  const filtersToolbar = (
    <div className={styles.filtersToolbar}>
      <SourceTabs tabs={sourceTabs} selected={selectedSource} onSelect={onSourceFilter} />
      <DrugStatusFilter
        options={drugStatusOptions}
        selected={selectedDrugStatuses}
        onChange={onDrugStatusFilter}
      />
    </div>
  );

  if (results.length === 0 && totalResults === 0) {
    return (
      <div className={styles.wrapper}>
        {filtersToolbar}
        <DrugStatusBreadcrumbs items={drugStatusBreadcrumbs} onRemove={onDrugStatusFilter} />
        <div className={styles.stateBox}>
          <p>No ADC results for &quot;{sanitizedQuery}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {filtersToolbar}
      <DrugStatusBreadcrumbs items={drugStatusBreadcrumbs} onRemove={onDrugStatusFilter} />

      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>
          {totalResults} result{totalResults === 1 ? '' : 's'}
          {sanitizedQuery && (
            <span className={styles.queryHint}> for &quot;{sanitizedQuery}&quot;</span>
          )}
        </h2>
        <span className={styles.timing}>{searchTimeMs}ms</span>
      </div>

      <div className={styles.grid} role="list">
        {results.map((result) => {
          const meta = getAdcSourceMeta(result.sourceType);
          const expanded = expandedId === result.id;
          return (
            <article key={result.id} className={styles.row} role="listitem">
              <button
                type="button"
                className={styles.rowHeader}
                onClick={() => toggleExpand(result.id)}
                aria-expanded={expanded}
              >
                <span className={styles.rank}>{result.rank ?? '—'}</span>
                <span className={`${styles.typeIcon} ${styles[meta.className]}`} style={{ color: meta.color }}>
                  <AdcSourceIcon sourceType={result.sourceType} />
                </span>
                <span className={styles.rowMain}>
                  <span className={styles.rowTitle}>{result.title}</span>
                  <span className={styles.rowMeta}>
                    <span className={styles.idTag}>ID: {result.adcId}</span>
                    <span className={styles.typeTag}>{meta.label}</span>
                  </span>
                </span>
                <span className={styles.relevance}>
                  <span className={styles.relevanceValue}>
                    {formatRelevancePercent(result.relevanceScore)}%
                  </span>
                  <span className={styles.relevanceBar} aria-hidden>
                    <span
                      className={styles.relevanceFill}
                      style={{ width: `${Math.min(100, result.relevanceScore ?? 0)}%` }}
                    />
                  </span>
                </span>
                <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} aria-hidden>
                  ▾
                </span>
              </button>

              {expanded && result.details && (
                <div className={styles.rowBody}>
                  <dl className={styles.detailGrid}>
                    {ADC_DETAIL_FIELDS.map(({ key, label, fullWidth, isLink }) => (
                      <DetailItem
                        key={key}
                        label={label}
                        value={formatDetailValue(result.details[key])}
                        fullWidth={fullWidth}
                        isLink={isLink}
                      />
                    ))}
                  </dl>
                  {typeof result.searchScore === 'number' && (
                    <p className={styles.rawScore}>Match score: {result.searchScore.toFixed(4)}</p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={pageNumber <= 1}
            onClick={() => onPageChange?.(pageNumber - 1)}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pageNumber} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={pageNumber >= totalPages}
            onClick={() => onPageChange?.(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

function formatDetailValue(value) {
  if (value == null || value === '') return null;
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return String(value);
}

function DetailItem({ label, value, fullWidth, isLink }) {
  const empty = value == null || value === '';
  return (
    <div className={`${styles.detailItem} ${fullWidth ? styles.detailFull : ''}`}>
      <dt>{label}</dt>
      <dd>
        {empty ? (
          '—'
        ) : isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function SourceTabs({ tabs, selected, onSelect }) {
  return (
    <div className={styles.sourceTabs} role="tablist" aria-label="Source filters">
      {tabs.map(({ value, count }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={selected === value}
          className={`${styles.sourceTab} ${selected === value ? styles.sourceTabActive : ''}`}
          onClick={() => onSelect?.(value)}
        >
          {value === ALL_SOURCES ? 'All sources' : value}
          <span className={styles.tabCount}>{count}</span>
        </button>
      ))}
      {selected !== ALL_SOURCES && (
        <button type="button" className={styles.clearFilters} onClick={() => onSelect?.(ALL_SOURCES)}>
          Clear
        </button>
      )}
    </div>
  );
}

function DrugStatusFilter({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handle = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const toggleValue = (value) => {
    const isOn = selected.includes(value);
    const next = isOn ? selected.filter((v) => v !== value) : [...selected, value];
    onChange?.(next);
  };

  const label =
    selected.length === 0 ? DRUG_STATUS_LABEL : `${DRUG_STATUS_LABEL} (${selected.length})`;

  if (options.length === 0) {
    return null;
  }

  return (
    <div className={styles.drugStatusFilter} ref={rootRef}>
      <button
        type="button"
        className={styles.drugStatusTrigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <span className={styles.drugStatusChevron} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <ul className={styles.drugStatusPanel} role="listbox" aria-multiselectable="true">
          {options.map(({ value, count }) => {
            const isSelected = selected.includes(value);
            return (
              <li key={value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={styles.drugStatusOption}
                  onClick={() => toggleValue(value)}
                >
                  <span className={`${styles.drugStatusTick} ${isSelected ? styles.drugStatusTickOn : ''}`} aria-hidden>
                    ✓
                  </span>
                  <span className={styles.drugStatusOptionLabel}>{value}</span>
                  <span className={styles.drugStatusOptionCount}>{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DrugStatusBreadcrumbs({ items, onRemove }) {
  if (!items?.length) return null;
  return (
    <div className={styles.filterBreadcrumbs} aria-label="Drug status filters">
      {items.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={styles.filterCrumb}
          onClick={() => onRemove?.(items.filter((i) => i.value !== value).map((i) => i.value))}
        >
          <span className={styles.filterCrumbLabel}>{label}</span>
          <span className={styles.filterCrumbRemove} aria-hidden>
            ×
          </span>
        </button>
      ))}
    </div>
  );
}

export default AdcSearchResults;
