const SAVED_KEY = "jobTrackerSaved";

export function getSavedJobIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function toggleSavedJob(jobId: string): boolean {
  const saved = getSavedJobIds();
  const idx = saved.indexOf(jobId);
  if (idx >= 0) {
    saved.splice(idx, 1);
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    return false;
  } else {
    saved.push(jobId);
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    return true;
  }
}

export function isJobSaved(jobId: string): boolean {
  return getSavedJobIds().includes(jobId);
}
