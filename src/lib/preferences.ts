export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

const PREFS_KEY = "jobTrackerPreferences";

export function getPreferences(): Preferences | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePreferences(prefs: Preferences): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export const LOCATIONS = [
  "Bengaluru", "Mumbai", "Chennai", "Hyderabad", "Pune", "Noida", "Mysuru"
];

export const MODES = ["Remote", "Hybrid", "Onsite"];
export const EXPERIENCE_LEVELS = ["Fresher", "0-1", "1-3", "3-5"];
export const SOURCES = ["LinkedIn", "Naukri", "Indeed"];
