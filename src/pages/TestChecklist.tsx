import { useState, useEffect } from "react";
import { Info } from "lucide-react";

const TEST_KEY = "jobTrackerTestChecklist";

const testItems = [
  { id: "t1", label: "Preferences persist after refresh", hint: "Set preferences, refresh, verify they're still there." },
  { id: "t2", label: "Match score calculates correctly", hint: "Set keywords that match a job title, check score increases." },
  { id: "t3", label: '"Show only matches" toggle works', hint: "Enable toggle on dashboard, verify low-score jobs are hidden." },
  { id: "t4", label: "Save job persists after refresh", hint: "Save a job, refresh, check /saved page." },
  { id: "t5", label: "Apply opens in new tab", hint: 'Click "Apply" on any job card.' },
  { id: "t6", label: "Status update persists after refresh", hint: "Change a job status, refresh, confirm it's still set." },
  { id: "t7", label: "Status filter works correctly", hint: "Filter by a status on dashboard, verify correct jobs show." },
  { id: "t8", label: "Digest generates top 10 by score", hint: "Generate digest, confirm top scored jobs appear." },
  { id: "t9", label: "Digest persists for the day", hint: "Generate digest, refresh, confirm it loads without regenerating." },
  { id: "t10", label: "No console errors on main pages", hint: "Open browser console, navigate all pages, check for errors." },
];

function getChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(TEST_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>) {
  localStorage.setItem(TEST_KEY, JSON.stringify(checked));
}

export function areAllTestsPassed(): boolean {
  const checked = getChecked();
  return testItems.every((t) => checked[t.id]);
}

export default function TestChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(getChecked);
  const [hoverHint, setHoverHint] = useState<string | null>(null);

  const passedCount = testItems.filter((t) => checked[t.id]).length;

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    saveChecked(next);
  };

  const reset = () => {
    setChecked({});
    localStorage.removeItem(TEST_KEY);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="heading-section mb-2">Test Checklist</h1>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Tests Passed: <span className="font-semibold text-foreground">{passedCount} / {testItems.length}</span>
        </p>
        {passedCount < testItems.length && (
          <p className="text-xs text-primary">Resolve all issues before shipping.</p>
        )}
      </div>

      <div className="premium-card space-y-1">
        {testItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-3 px-2 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="rounded border-border w-4 h-4 accent-primary shrink-0"
            />
            <span className={`text-sm flex-1 ${checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {item.label}
            </span>
            <div className="relative">
              <button
                onMouseEnter={() => setHoverHint(item.id)}
                onMouseLeave={() => setHoverHint(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {hoverHint === item.id && (
                <div className="absolute right-0 top-6 z-10 bg-card border border-border rounded-md p-2 text-xs text-muted-foreground w-48 shadow-md">
                  {item.hint}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Reset Test Status
        </button>
      </div>
    </div>
  );
}
