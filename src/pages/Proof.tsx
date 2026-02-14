import { useState, useEffect, useMemo } from "react";
import { areAllTestsPassed } from "./TestChecklist";
import { toast } from "sonner";
import { Copy, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { z } from "zod";

const PROOF_KEY = "jobTrackerProof";

const urlSchema = z.string().url("Must be a valid URL");

const steps = [
  "App skeleton created",
  "Realistic dataset loaded",
  "Preferences logic implemented",
  "Match scoring engine built",
  "Daily digest engine added",
  "Job status tracking added",
  "Test checklist created",
  "Proof & submission finalized",
];

interface ProofData {
  lovableUrl: string;
  githubUrl: string;
  deployedUrl: string;
}

function getProofData(): ProofData {
  try {
    const raw = localStorage.getItem(PROOF_KEY);
    if (!raw) return { lovableUrl: "", githubUrl: "", deployedUrl: "" };
    return JSON.parse(raw);
  } catch {
    return { lovableUrl: "", githubUrl: "", deployedUrl: "" };
  }
}

function saveProofData(data: ProofData) {
  localStorage.setItem(PROOF_KEY, JSON.stringify(data));
}

export default function Proof() {
  const [form, setForm] = useState<ProofData>(getProofData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const allTestsPassed = areAllTestsPassed();

  const allLinksProvided = form.lovableUrl && form.githubUrl && form.deployedUrl;
  const allLinksValid = useMemo(() => {
    try {
      urlSchema.parse(form.lovableUrl);
      urlSchema.parse(form.githubUrl);
      urlSchema.parse(form.deployedUrl);
      return true;
    } catch {
      return false;
    }
  }, [form]);

  const canShip = allTestsPassed && allLinksProvided && allLinksValid;

  const shipStatus: "Not Started" | "In Progress" | "Shipped" = !allLinksProvided
    ? "Not Started"
    : canShip
    ? "Shipped"
    : "In Progress";

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    ["lovableUrl", "githubUrl", "deployedUrl"].forEach((field) => {
      const val = form[field as keyof ProofData];
      if (val) {
        const result = urlSchema.safeParse(val);
        if (!result.success) newErrors[field] = "Invalid URL format";
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      saveProofData(form);
      toast("Proof data saved.");
    }
  };

  const copySubmission = () => {
    const text = `------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${form.lovableUrl}

GitHub Repository:
${form.githubUrl}

Live Deployment:
${form.deployedUrl}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------`;
    navigator.clipboard.writeText(text);
    toast("Submission copied to clipboard.");
  };

  const inputClass = "w-full border border-border rounded-md px-3 py-2 bg-card text-foreground text-sm";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="heading-section mb-2">Proof & Submission</h1>
      <p className="text-sm text-muted-foreground mb-8">Project 1 — Job Notification Tracker</p>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-6">
        {shipStatus === "Shipped" ? (
          <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full badge-score-high">
            <CheckCircle className="w-3.5 h-3.5" /> Shipped
          </span>
        ) : shipStatus === "In Progress" ? (
          <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full badge-score-medium">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full badge-score-neutral">
            <AlertCircle className="w-3.5 h-3.5" /> Not Started
          </span>
        )}
      </div>

      {/* Step Completion */}
      <div className="premium-card mb-6">
        <h2 className="font-serif text-lg font-semibold mb-4">Step Completion Summary</h2>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success shrink-0" />
              <span className="text-foreground">Step {i + 1}: {step}</span>
              <span className="text-xs text-muted-foreground ml-auto">Completed</span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Status */}
      <div className="premium-card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Test Checklist</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${allTestsPassed ? "badge-score-high" : "badge-score-medium"}`}>
            {allTestsPassed ? "All Passed" : "Incomplete"}
          </span>
        </div>
        {!allTestsPassed && (
          <p className="text-xs text-muted-foreground mt-2">Complete all 10 test items before shipping.</p>
        )}
      </div>

      {/* Artifact Links */}
      <div className="premium-card mb-6 space-y-4">
        <h2 className="font-serif text-lg font-semibold">Artifact Collection</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Lovable Project Link</label>
          <input
            type="url"
            placeholder="https://lovable.dev/projects/..."
            value={form.lovableUrl}
            onChange={(e) => setForm((f) => ({ ...f, lovableUrl: e.target.value }))}
            className={inputClass}
          />
          {errors.lovableUrl && <p className="text-xs text-destructive mt-1">{errors.lovableUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">GitHub Repository Link</label>
          <input
            type="url"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
            className={inputClass}
          />
          {errors.githubUrl && <p className="text-xs text-destructive mt-1">{errors.githubUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deployed URL</label>
          <input
            type="url"
            placeholder="https://..."
            value={form.deployedUrl}
            onChange={(e) => setForm((f) => ({ ...f, deployedUrl: e.target.value }))}
            className={inputClass}
          />
          {errors.deployedUrl && <p className="text-xs text-destructive mt-1">{errors.deployedUrl}</p>}
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-colors"
        >
          Save Links
        </button>
      </div>

      {/* Submission */}
      <div className="premium-card text-center">
        <button
          onClick={copySubmission}
          disabled={!canShip}
          className={`flex items-center gap-2 mx-auto px-6 py-2.5 rounded-md font-medium transition-opacity ${
            canShip
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <Copy className="w-4 h-4" /> Copy Final Submission
        </button>
        {!canShip && (
          <p className="text-xs text-muted-foreground mt-3">
            {!allTestsPassed ? "Pass all 10 tests first. " : ""}
            {!allLinksProvided ? "Provide all 3 links. " : ""}
            {allLinksProvided && !allLinksValid ? "Fix invalid URLs. " : ""}
          </p>
        )}
        {canShip && (
          <p className="text-sm text-muted-foreground mt-4 font-serif italic">
            Project 1 Shipped Successfully.
          </p>
        )}
      </div>
    </div>
  );
}
