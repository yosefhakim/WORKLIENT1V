const KEY = "worklient_recently_viewed";
const MAX_ITEMS = 8;

export function getRecentlyViewed(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(jobId: number): void {
  const current = getRecentlyViewed().filter((id) => id !== jobId);
  current.unshift(jobId);
  localStorage.setItem(KEY, JSON.stringify(current.slice(0, MAX_ITEMS)));
}
