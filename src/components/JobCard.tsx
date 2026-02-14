import type { Job } from "@/data/jobs";
import type { JobStatus } from "@/lib/jobStatus";
import { getStatusClass, ALL_STATUSES } from "@/lib/jobStatus";
import { Bookmark, ExternalLink, Eye } from "lucide-react";

interface JobCardProps {
  job: Job;
  matchScore?: number | null;
  scoreClass?: string;
  isSaved: boolean;
  status: JobStatus;
  onSave: () => void;
  onView: () => void;
  onStatusChange: (status: JobStatus) => void;
}

export default function JobCard({
  job,
  matchScore,
  scoreClass,
  isSaved,
  status,
  onSave,
  onView,
  onStatusChange,
}: JobCardProps) {
  const daysText =
    job.postedDaysAgo === 0
      ? "Today"
      : job.postedDaysAgo === 1
      ? "1 day ago"
      : `${job.postedDaysAgo} days ago`;

  return (
    <div className="premium-card animate-fade-in flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-semibold text-foreground truncate">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {matchScore !== null && matchScore !== undefined && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${scoreClass}`}>
              {matchScore}%
            </span>
          )}
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
            {job.source}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{job.location}</span>
        <span>•</span>
        <span>{job.mode}</span>
        <span>•</span>
        <span>{job.experience}</span>
        <span>•</span>
        <span>{job.salaryRange}</span>
      </div>

      <p className="text-xs text-muted-foreground">{daysText}</p>

      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-border">
        <button
          onClick={onView}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-muted"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button
          onClick={onSave}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ${
            isSaved
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" /> {isSaved ? "Saved" : "Save"}
        </button>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Apply
        </a>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as JobStatus)}
          className={`ml-auto text-xs px-2.5 py-1.5 rounded-md border border-border ${getStatusClass(status)}`}
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
