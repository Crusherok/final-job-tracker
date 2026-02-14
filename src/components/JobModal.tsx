import type { Job } from "@/data/jobs";
import { X } from "lucide-react";

interface JobModalProps {
  job: Job;
  onClose: () => void;
}

export default function JobModal({ job, onClose }: JobModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-lg border border-border p-6 md:p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto shadow-lg animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">{job.title}</h2>
            <p className="text-sm text-muted-foreground">{job.company} — {job.location}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{job.mode}</span>
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{job.experience}</span>
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{job.salaryRange}</span>
            <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{job.source}</span>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold mb-1">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold mb-1">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {job.skills.map((s) => (
                <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>

          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Apply Now →
          </a>
        </div>
      </div>
    </div>
  );
}
