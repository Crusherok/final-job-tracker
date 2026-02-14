import type { Job } from "@/data/jobs";
import type { Preferences } from "./preferences";

export function computeMatchScore(job: Job, prefs: Preferences): number {
  let score = 0;

  const keywords = prefs.roleKeywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const userSkills = prefs.skills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // +25 if any roleKeyword appears in job.title
  if (keywords.some((kw) => job.title.toLowerCase().includes(kw))) {
    score += 25;
  }

  // +15 if any roleKeyword appears in job.description
  if (keywords.some((kw) => job.description.toLowerCase().includes(kw))) {
    score += 15;
  }

  // +15 if job.location matches preferredLocations
  if (prefs.preferredLocations.some((loc) => loc === job.location)) {
    score += 15;
  }

  // +10 if job.mode matches preferredMode
  if (prefs.preferredMode.some((m) => m === job.mode)) {
    score += 10;
  }

  // +10 if job.experience matches experienceLevel
  if (prefs.experienceLevel === job.experience) {
    score += 10;
  }

  // +15 if overlap between job.skills and user.skills
  if (
    job.skills.some((s) =>
      userSkills.some((us) => s.toLowerCase().includes(us) || us.includes(s.toLowerCase()))
    )
  ) {
    score += 15;
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") {
    score += 5;
  }

  return Math.min(score, 100);
}

export function getScoreClass(score: number): string {
  if (score >= 80) return "badge-score-high";
  if (score >= 60) return "badge-score-medium";
  if (score >= 40) return "badge-score-neutral";
  return "badge-score-low";
}
