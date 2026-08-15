export const PREFERRED_SEARCHES_UPDATED = 'preferredSearchesUpdated';

export const notifyPreferredSearchesUpdated = () => {
  window.dispatchEvent(new CustomEvent(PREFERRED_SEARCHES_UPDATED));
};
