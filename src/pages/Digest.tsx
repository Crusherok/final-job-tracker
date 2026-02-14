import { useState, useMemo } from "react";
import { jobs } from "@/data/jobs";
import { getPreferences } from "@/lib/preferences";
import { computeMatchScore, getScoreClass } from "@/lib/matchEngine";
import { getDigest, saveDigest, getTodayKey, formatDigestText, type Digest } from "@/lib/digest";
import { getStatusLog } from "@/lib/jobStatus";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Copy, Mail, ExternalLink } from "lucide-react";

export default function DigestPage() {
  const prefs = getPreferences();
  const todayKey = getTodayKey();
  const [digest, setDigest] = useState<Digest | null>(() => getDigest(todayKey));
  const statusLog = getStatusLog();

  const generateDigest = () => {
    if (!prefs) return;

    const scored = jobs
      .map((job) => ({ job, matchScore: computeMatchScore(job, prefs) }))
      .filter((e) => e.matchScore >= prefs.minMatchScore)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        return a.job.postedDaysAgo - b.job.postedDaysAgo;
      })
      .slice(0, 10);

    const newDigest: Digest = {
      date: todayKey,
      entries: scored,
    };
    saveDigest(newDigest);
    setDigest(newDigest);
    toast("Digest generated for today.");
  };

  const copyDigest = () => {
    if (!digest) return;
    navigator.clipboard.writeText(formatDigestText(digest));
    toast("Digest copied to clipboard.");
  };

  const emailDigest = () => {
    if (!digest) return;
    const body = encodeURIComponent(formatDigestText(digest));
    window.open(`mailto:?subject=${encodeURIComponent("My 9AM Job Digest")}&body=${body}`);
  };

  if (!prefs) {
    return (
      <div>
        <h1 className="heading-section mb-6">Daily Digest</h1>
        <div className="empty-state">
          <h2 className="font-serif text-xl font-semibold mb-2">Set preferences to generate a personalized digest.</h2>
          <Link to="/settings" className="text-primary hover:underline text-sm mt-2">Go to Settings →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="heading-section mb-6">Daily Digest</h1>

      {!digest ? (
        <div className="empty-state">
          <button
            onClick={generateDigest}
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Generate Today's 9AM Digest (Simulated)
          </button>
          <p className="text-xs text-muted-foreground mt-4">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      ) : digest.entries.length === 0 ? (
        <div className="empty-state">
          <h2 className="font-serif text-xl font-semibold mb-2">No matching roles today.</h2>
          <p className="text-muted-foreground">Check again tomorrow.</p>
        </div>
      ) : (
        <div className="premium-card">
          <div className="text-center mb-6 pb-4 border-b border-border">
            <h2 className="font-serif text-2xl font-bold text-foreground">Top 10 Jobs For You — 9AM Digest</h2>
            <p className="text-sm text-muted-foreground mt-1">{digest.date}</p>
          </div>

          <div className="space-y-4">
            {digest.entries.map((entry, i) => (
              <div key={entry.job.id} className="flex items-start gap-3 p-3 rounded-md bg-background border border-border">
                <span className="text-xs font-bold text-muted-foreground mt-1 w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-foreground">{entry.job.title}</h3>
                  <p className="text-xs text-muted-foreground">{entry.job.company} — {entry.job.location}</p>
                  <p className="text-xs text-muted-foreground">{entry.job.experience}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getScoreClass(entry.matchScore)}`}>
                    {entry.matchScore}%
                  </span>
                  <a
                    href={entry.job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:opacity-80"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">
              This digest was generated based on your preferences.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={copyDigest} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
                <Copy className="w-3.5 h-3.5" /> Copy Digest
              </button>
              <button onClick={emailDigest} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
                <Mail className="w-3.5 h-3.5" /> Email Draft
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">Demo Mode: Daily 9AM trigger simulated manually.</p>
          </div>
        </div>
      )}

      {statusLog.length > 0 && (
        <div className="mt-8">
          <h2 className="heading-section text-lg mb-4">Recent Status Updates</h2>
          <div className="premium-card">
            <div className="space-y-2">
              {statusLog.slice(0, 10).map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium text-foreground">{entry.jobTitle}</span>
                    <span className="text-muted-foreground"> at {entry.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      entry.status === "Applied" ? "status-applied" :
                      entry.status === "Rejected" ? "status-rejected" :
                      entry.status === "Selected" ? "status-selected" : "status-not-applied"
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
