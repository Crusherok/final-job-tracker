import type { Job } from "@/data/jobs";

export interface DigestEntry {
  job: Job;
  matchScore: number;
}

export interface Digest {
  date: string;
  entries: DigestEntry[];
}

function getDigestKey(date: string): string {
  return `jobTrackerDigest_${date}`;
}

export function getTodayKey(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function getDigest(date: string): Digest | null {
  try {
    const raw = localStorage.getItem(getDigestKey(date));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDigest(digest: Digest): void {
  localStorage.setItem(getDigestKey(digest.date), JSON.stringify(digest));
}

export function formatDigestText(digest: Digest): string {
  let text = `Top 10 Jobs For You — 9AM Digest\nDate: ${digest.date}\n\n`;
  digest.entries.forEach((e, i) => {
    text += `${i + 1}. ${e.job.title} at ${e.job.company}\n`;
    text += `   Location: ${e.job.location} | Experience: ${e.job.experience}\n`;
    text += `   Match Score: ${e.matchScore}%\n`;
    text += `   Apply: ${e.job.applyUrl}\n\n`;
  });
  text += "This digest was generated based on your preferences.";
  return text;
}
