export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

const STATUS_KEY = "jobTrackerStatus";
const STATUS_LOG_KEY = "jobTrackerStatusLog";

export interface StatusLogEntry {
  jobId: string;
  jobTitle: string;
  company: string;
  status: JobStatus;
  date: string;
}

export function getAllStatuses(): Record<string, JobStatus> {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getJobStatus(jobId: string): JobStatus {
  const all = getAllStatuses();
  return all[jobId] || "Not Applied";
}

export function setJobStatus(jobId: string, status: JobStatus, jobTitle: string, company: string): void {
  const all = getAllStatuses();
  all[jobId] = status;
  localStorage.setItem(STATUS_KEY, JSON.stringify(all));

  if (status !== "Not Applied") {
    const log = getStatusLog();
    log.unshift({
      jobId,
      jobTitle,
      company,
      status,
      date: new Date().toISOString(),
    });
    localStorage.setItem(STATUS_LOG_KEY, JSON.stringify(log.slice(0, 50)));
  }
}

export function getStatusLog(): StatusLogEntry[] {
  try {
    const raw = localStorage.getItem(STATUS_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getStatusClass(status: JobStatus): string {
  switch (status) {
    case "Applied": return "status-applied";
    case "Rejected": return "status-rejected";
    case "Selected": return "status-selected";
    default: return "status-not-applied";
  }
}

export const ALL_STATUSES: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];
