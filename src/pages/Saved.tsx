import { useState, useMemo, useCallback } from "react";
import { jobs } from "@/data/jobs";
import { getSavedJobIds, toggleSavedJob } from "@/lib/savedJobs";
import { getJobStatus, setJobStatus, type JobStatus } from "@/lib/jobStatus";
import { getPreferences } from "@/lib/preferences";
import { computeMatchScore, getScoreClass } from "@/lib/matchEngine";
import JobCard from "@/components/JobCard";
import JobModal from "@/components/JobModal";
import { toast } from "sonner";
import type { Job } from "@/data/jobs";

export default function SavedPage() {
  const prefs = getPreferences();
  const [savedIds, setSavedIds] = useState(() => new Set(getSavedJobIds()));
  const [statuses, setStatuses] = useState<Record<string, JobStatus>>(() => {
    const result: Record<string, JobStatus> = {};
    jobs.forEach((j) => { result[j.id] = getJobStatus(j.id); });
    return result;
  });
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const savedJobs = useMemo(() => {
    return jobs.filter((j) => savedIds.has(j.id));
  }, [savedIds]);

  const handleSave = useCallback((jobId: string) => {
    const nowSaved = toggleSavedJob(jobId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(jobId); else next.delete(jobId);
      return next;
    });
    toast(nowSaved ? "Job saved" : "Job removed from saved");
  }, []);

  const handleStatusChange = useCallback((jobId: string, status: JobStatus, title: string, company: string) => {
    setJobStatus(jobId, status, title, company);
    setStatuses((prev) => ({ ...prev, [jobId]: status }));
    toast(`Status updated: ${status}`);
  }, []);

  if (savedJobs.length === 0) {
    return (
      <div>
        <h1 className="heading-section mb-6">Saved Jobs</h1>
        <div className="empty-state">
          <h2 className="font-serif text-xl font-semibold mb-2">No saved jobs yet.</h2>
          <p className="text-muted-foreground">Browse the dashboard and save jobs you're interested in.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="heading-section mb-6">Saved Jobs</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedJobs.map((job) => {
          const score = prefs ? computeMatchScore(job, prefs) : null;
          return (
            <JobCard
              key={job.id}
              job={job}
              matchScore={score}
              scoreClass={score !== null ? getScoreClass(score) : undefined}
              isSaved={true}
              status={statuses[job.id] || "Not Applied"}
              onSave={() => handleSave(job.id)}
              onView={() => setViewJob(job)}
              onStatusChange={(s) => handleStatusChange(job.id, s, job.title, job.company)}
            />
          );
        })}
      </div>
      {viewJob && <JobModal job={viewJob} onClose={() => setViewJob(null)} />}
    </div>
  );
}
