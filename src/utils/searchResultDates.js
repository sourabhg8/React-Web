/**
 * Parse a date string from API/index (ISO or common formats).
 */
export const parseApiDate = (value) => {
  if (value == null || value === '') return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * True when publishDate is after the saved search's previous lastSearchedAt timestamp.
 */
export const isResultNewSinceSavedSearch = (publishDate, savedSearchLastSearchedAt) => {
  const published = parseApiDate(publishDate);
  const lastSearched = parseApiDate(savedSearchLastSearchedAt);
  if (!published || !lastSearched) return false;
  return published > lastSearched;
};

/**
 * Resolve publishDate from a search result (camelCase or PascalCase).
 */
export const getPublishDate = (result) =>
  result.publishDate ??
  result.PublishDate ??
  result.metadata?.publishDate ??
  result.metadata?.PublishDate ??
  '';

/**
 * Format publish date for display.
 */
export const formatPublishDate = (value) => {
  const parsed = parseApiDate(value);
  if (!parsed) return typeof value === 'string' ? value.trim() : '';
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
