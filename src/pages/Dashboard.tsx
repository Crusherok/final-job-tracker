import { useState, useMemo, useCallback } from "react";
import { jobs } from "@/data/jobs";
import { getPreferences } from "@/lib/preferences";
import { computeMatchScore, getScoreClass } from "@/lib/matchEngine";
import { isJobSaved, toggleSavedJob } from "@/lib/savedJobs";
import { getJobStatus, setJobStatus, type JobStatus } from "@/lib/jobStatus";
import JobCard from "@/components/JobCard";
import JobModal from "@/components/JobModal";
import FilterBar from "@/components/FilterBar";
import { toast } from "sonner";
import type { Job } from "@/data/jobs";
import { Link } from "react-router-dom";

function extractSalaryNum(s: string): number {
  const match = s.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function Dashboard() {
  const prefs = getPreferences();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("");
  const [experience, setExperience] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("");
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [savedIds, setSavedIds] = useState(() => new Set(jobs.map((j) => j.id).filter(isJobSaved)));
  const [statuses, setStatuses] = useState<Record<string, JobStatus>>(() => {
    const result: Record<string, JobStatus> = {};
    jobs.forEach((j) => { result[j.id] = getJobStatus(j.id); });
    return result;
  });
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const scored = useMemo(() => {
    return jobs.map((job) => ({
      job,
      matchScore: prefs ? computeMatchScore(job, prefs) : null,
    }));
  }, [prefs]);

  const filtered = useMemo(() => {
    let list = scored;

    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(
        (e) =>
          e.job.title.toLowerCase().includes(kw) ||
          e.job.company.toLowerCase().includes(kw)
      );
    }
    if (location) list = list.filter((e) => e.job.location === location);
    if (mode) list = list.filter((e) => e.job.mode === mode);
    if (experience) list = list.filter((e) => e.job.experience === experience);
    if (source) list = list.filter((e) => e.job.source === source);
    if (statusFilter) list = list.filter((e) => (statuses[e.job.id] || "Not Applied") === statusFilter);
    if (showOnlyMatches && prefs) {
      list = list.filter((e) => (e.matchScore ?? 0) >= prefs.minMatchScore);
    }

    if (sort === "latest") {
      list = [...list].sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo);
    } else if (sort === "score") {
      list = [...list].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    } else if (sort === "salary") {
      list = [...list].sort((a, b) => extractSalaryNum(b.job.salaryRange) - extractSalaryNum(a.job.salaryRange));
    }

    return list;
  }, [scored, keyword, location, mode, experience, source, sort, statusFilter, showOnlyMatches, statuses, prefs]);

  const handleSave = useCallback((jobId: string) => {
    const nowSaved = toggleSavedJob(jobId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(jobId); else next.delete(jobId);
      return next;
    });
    toast(nowSaved ? "Job saved" : "Job unsaved");
  }, []);

  const handleStatusChange = useCallback((jobId: string, status: JobStatus, title: string, company: string) => {
    setJobStatus(jobId, status, title, company);
    setStatuses((prev) => ({ ...prev, [jobId]: status }));
    toast(`Status updated: ${status}`);
  }, []);

  return (
    <div>
      <h1 className="heading-section mb-6">Dashboard</h1>

      {!prefs && (
        <div className="premium-card mb-6 border-l-4 border-l-primary">
          <p className="text-sm text-muted-foreground">
            <Link to="/settings" className="text-primary font-medium hover:underline">Set your preferences</Link> to activate intelligent matching.
          </p>
        </div>
      )}

      <FilterBar
        keyword={keyword} onKeywordChange={setKeyword}
        location={location} onLocationChange={setLocation}
        mode={mode} onModeChange={setMode}
        experience={experience} onExperienceChange={setExperience}
        source={source} onSourceChange={setSource}
        sort={sort} onSortChange={setSort}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
        showOnlyMatches={showOnlyMatches} onShowOnlyMatchesChange={setShowOnlyMatches}
        hasPreferences={!!prefs}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2 className="heading-section mb-2">No roles match your criteria.</h2>
          <p className="text-muted-foreground">Adjust filters or lower threshold.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ job, matchScore }) => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={matchScore}
              scoreClass={matchScore !== null ? getScoreClass(matchScore) : undefined}
              isSaved={savedIds.has(job.id)}
              status={statuses[job.id] || "Not Applied"}
              onSave={() => handleSave(job.id)}
              onView={() => setViewJob(job)}
              onStatusChange={(s) => handleStatusChange(job.id, s, job.title, job.company)}
            />
          ))}
        </div>
      )}

      {viewJob && <JobModal job={viewJob} onClose={() => setViewJob(null)} />}
    </div>
  );
}
