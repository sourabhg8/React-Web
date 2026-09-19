/**
 * Display relevance % with two decimal places (e.g. 50.89).
 */
export function formatRelevancePercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '';
  }
  return value.toFixed(2);
}
