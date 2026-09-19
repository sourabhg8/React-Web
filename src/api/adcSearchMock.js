/**
 * Mock ADC search API — replace with real POST /api/Search/adc when backend is ready.
 */

const PAGE_SIZE_DEFAULT = 10;

const MOCK_RECORDS = [
  {
    id: 'adc-1',
    rank: 1,
    title: 'BL-B01D1 (Bispecific EGFR×HER3 ADC)',
    adcId: 'DRG0IFWXM',
    sourceType: 'ADC',
    relevanceScore: 88,
    searchScore: 0.0482,
    isNew: true,
    details: {
      drugStatus: 'Phase II',
      antibody: 'Anti-EGFR / Anti-HER3',
      payload: 'Topoisomerase I inhibitor',
      linker: 'Cleavable peptide linker',
      developer: 'SystImmune / BMS',
      firstApproval: '—',
      indication: 'Solid tumors',
    },
  },
  {
    id: 'adc-2',
    rank: 2,
    title: 'Trastuzumab deruxtecan (T-DXd, Enhertu)',
    adcId: 'DRG9K2PLM',
    sourceType: 'ADC',
    relevanceScore: 85,
    searchScore: 0.0441,
    isNew: false,
    details: {
      drugStatus: 'Approved',
      antibody: 'Trastuzumab (anti-HER2)',
      payload: 'Deruxtecan (TOP1i)',
      linker: 'Tetrapeptide-based cleavable linker',
      developer: 'Daiichi Sankyo / AstraZeneca',
      firstApproval: '2019',
      indication: 'HER2+ breast cancer, HER2-low breast cancer',
    },
  },
  {
    id: 'adc-3',
    rank: 3,
    title: 'Disitamab vedotin',
    adcId: 'ABT7721Q',
    sourceType: 'Antibody',
    relevanceScore: 78,
    searchScore: 0.0388,
    isNew: true,
    details: {
      drugStatus: 'Approved (CN)',
      antibody: 'Disitamab (anti-HER2)',
      payload: 'MMAE',
      linker: 'Val-Cit cleavable linker',
      developer: 'RemeGen',
      firstApproval: '2021',
      indication: 'Urothelial carcinoma, gastric cancer',
    },
  },
  {
    id: 'adc-4',
    rank: 4,
    title: 'Deruxtecan (DXd) payload platform',
    adcId: 'PLD8834X',
    sourceType: 'Payload',
    relevanceScore: 72,
    searchScore: 0.0312,
    isNew: false,
    details: {
      drugStatus: 'Clinical / commercial (component)',
      antibody: '—',
      payload: 'Exatecan derivative (TOP1i)',
      linker: 'Compatible with cleavable linkers',
      developer: 'Daiichi Sankyo',
      firstApproval: '—',
      indication: 'Used in multiple ADC programs',
    },
  },
  {
    id: 'adc-5',
    rank: 5,
    title: 'Val-Cit-PAB linker system',
    adcId: 'LNK4410Z',
    sourceType: 'Linker',
    relevanceScore: 68,
    searchScore: 0.0289,
    isNew: false,
    details: {
      drugStatus: 'Platform',
      antibody: '—',
      payload: 'MMAE / MMAF compatible',
      linker: 'Val-Cit-PAB (cathepsin B cleavable)',
      developer: 'Multiple',
      firstApproval: '—',
      indication: 'ADC conjugation chemistry',
    },
  },
  {
    id: 'adc-6',
    rank: 6,
    title: 'Sacituzumab govitecan (Trodelvy)',
    adcId: 'DRG2AA19B',
    sourceType: 'ADC',
    relevanceScore: 81,
    searchScore: 0.0365,
    isNew: false,
    details: {
      drugStatus: 'Approved',
      antibody: 'Sacituzumab (anti-TROP2)',
      payload: 'SN-38 (TOP1i)',
      linker: 'CL2A linker',
      developer: 'Gilead',
      firstApproval: '2020',
      indication: 'TNBC, HR+ / HER2- breast cancer',
    },
  },
  {
    id: 'adc-7',
    rank: 7,
    title: 'Cetuximab sarotalocan',
    adcId: 'ABT11902C',
    sourceType: 'Antibody',
    relevanceScore: 64,
    searchScore: 0.0244,
    isNew: true,
    details: {
      drugStatus: 'Phase III',
      antibody: 'Cetuximab (anti-EGFR)',
      payload: 'Sarotalocan (photosensitizer)',
      linker: 'Proprietary linker',
      developer: 'Rakuten Medical',
      firstApproval: '—',
      indication: 'Head and neck cancer',
    },
  },
  {
    id: 'adc-8',
    rank: 8,
    title: 'MMAE (Monomethyl auristatin E)',
    adcId: 'PLD2201M',
    sourceType: 'Payload',
    relevanceScore: 70,
    searchScore: 0.0298,
    isNew: false,
    details: {
      drugStatus: 'Commercial (component)',
      antibody: '—',
      payload: 'MMAE (microtubule inhibitor)',
      linker: '—',
      developer: 'Seattle Genetics legacy',
      firstApproval: '—',
      indication: 'Used in Adcetris and others',
    },
  },
  {
    id: 'adc-9',
    rank: 9,
    title: 'SMCC / Hydrazone linker variants',
    adcId: 'LNK9921H',
    sourceType: 'Linker',
    relevanceScore: 58,
    searchScore: 0.0198,
    isNew: false,
    details: {
      drugStatus: 'Research / legacy platforms',
      antibody: '—',
      payload: 'Various',
      linker: 'SMCC, hydrazone (non-cleavable / acid-labile)',
      developer: 'Multiple',
      firstApproval: '—',
      indication: 'Early ADC conjugation',
    },
  },
  {
    id: 'adc-10',
    rank: 10,
    title: 'Patritumab deruxtecan (HER3-DXd)',
    adcId: 'DRG7HER3D',
    sourceType: 'ADC',
    relevanceScore: 76,
    searchScore: 0.0331,
    isNew: true,
    details: {
      drugStatus: 'Phase III',
      antibody: 'Patritumab (anti-HER3)',
      payload: 'Deruxtecan',
      linker: 'Cleavable peptide linker',
      developer: 'Daiichi Sankyo / Merck',
      firstApproval: '—',
      indication: 'EGFR-mutated NSCLC',
    },
  },
  {
    id: 'adc-11',
    rank: 11,
    title: 'Telisotuzumab vedotin',
    adcId: 'ADC5521T',
    sourceType: 'ADC',
    relevanceScore: 74,
    searchScore: 0.032,
    isNew: false,
    details: {
      drugStatus: 'Phase III',
      antibody: 'Telisotuzumab (anti-c-Met)',
      payload: 'MMAE',
      linker: 'Val-Cit-PAB',
      developer: 'AbbVie',
      firstApproval: '—',
      indication: 'c-Met overexpressing NSCLC',
    },
  },
  {
    id: 'adc-12',
    rank: 12,
    title: 'Registry cross-reference note',
    adcId: 'DOC8812R',
    sourceType: 'Other',
    relevanceScore: 52,
    searchScore: 0.0155,
    isNew: false,
    details: {
      drugStatus: 'Reference',
      antibody: '—',
      payload: '—',
      linker: '—',
      developer: 'Internal knowledge base',
      firstApproval: '—',
      indication: 'ADC pipeline metadata',
    },
  },
];

const SOURCE_TYPES = ['ADC', 'Antibody', 'Payload', 'Linker', 'Other'];

function tokenize(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function recordMatchesQuery(record, terms) {
  if (terms.length === 0) return true;
  const haystack = [
    record.title,
    record.adcId,
    record.sourceType,
    ...Object.values(record.details || {}),
  ]
    .join(' ')
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function buildFacetCounts(records) {
  const counts = {};
  SOURCE_TYPES.forEach((type) => {
    const n = records.filter((r) => r.sourceType === type).length;
    if (n > 0) counts[`sourceType:${type}`] = n;
  });
  return counts;
}

/**
 * @param {{ searchQuery: string, pageNumber?: number, pageSize?: number, filters?: Record<string, string[]> }} params
 */
export async function mockAdcSearch({
  searchQuery,
  pageNumber = 1,
  pageSize = PAGE_SIZE_DEFAULT,
  filters = {},
}) {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const sanitizedQuery = (searchQuery || '').trim();
  const terms = tokenize(sanitizedQuery);

  let matched = MOCK_RECORDS.filter((r) => recordMatchesQuery(r, terms));

  const sourceFilter = filters.sourceType ?? filters.source ?? [];
  if (sourceFilter.length > 0) {
    const allowed = new Set(sourceFilter.map((s) => s.toLowerCase()));
    matched = matched.filter((r) => allowed.has(r.sourceType.toLowerCase()));
  }

  const totalResults = matched.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize) || 1);
  const page = Math.min(Math.max(1, pageNumber), totalPages);
  const start = (page - 1) * pageSize;
  const pageItems = matched.slice(start, start + pageSize).map((item, idx) => ({
    ...item,
    rank: start + idx + 1,
  }));

  const allMatchingForFacets = MOCK_RECORDS.filter((r) => recordMatchesQuery(r, terms));
  const facetCounts = buildFacetCounts(allMatchingForFacets);
  facetCounts['sourceType:All'] = allMatchingForFacets.length;

  return {
    results: pageItems,
    totalResults,
    pageNumber: page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    sanitizedQuery,
    searchQuery: sanitizedQuery,
    searchTimeMs: 120 + Math.floor(Math.random() * 80),
    facetCounts,
  };
}

export { SOURCE_TYPES as ADC_SOURCE_TYPES };
