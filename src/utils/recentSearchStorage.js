const RECENT_SEARCHES_KEY = 'medai_recent_search_queries';
const MAX_RECENT_SEARCHES = 5;

export function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((q) => typeof q === 'string' && q.trim()).slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export function saveRecentSearch(query) {
  const trimmed = query?.trim();
  if (!trimmed) return loadRecentSearches();

  const existing = loadRecentSearches().filter(
    (q) => q.toLowerCase() !== trimmed.toLowerCase()
  );
  const updated = [trimmed, ...existing].slice(0, MAX_RECENT_SEARCHES);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota / private mode errors
  }

  return updated;
}
