import { useState, useEffect } from "react";
import {
  getPreferences,
  savePreferences,
  LOCATIONS,
  MODES,
  EXPERIENCE_LEVELS,
  type Preferences,
} from "@/lib/preferences";
import { toast } from "sonner";

export default function Settings() {
  const [form, setForm] = useState<Preferences>({
    roleKeywords: "",
    preferredLocations: [],
    preferredMode: [],
    experienceLevel: "",
    skills: "",
    minMatchScore: 40,
  });

  useEffect(() => {
    const saved = getPreferences();
    if (saved) setForm(saved);
  }, []);

  const handleSave = () => {
    savePreferences(form);
    toast("Preferences saved successfully.");
  };

  const toggleArrayItem = (arr: string[], item: string): string[] => {
    return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];
  };

  const inputClass = "w-full border border-border rounded-md px-3 py-2.5 bg-card text-foreground text-sm";
  const labelClass = "block text-sm font-semibold text-foreground mb-2";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="heading-section mb-8">Preferences</h1>

      <div className="premium-card space-y-7">
        <div>
          <label className={labelClass}>Role Keywords</label>
          <input
            type="text"
            placeholder="e.g. React, Backend, Intern"
            value={form.roleKeywords}
            onChange={(e) => setForm((f) => ({ ...f, roleKeywords: e.target.value }))}
            className={inputClass}
          />
          <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords</p>
        </div>

        <div>
          <label className={labelClass}>Preferred Locations</label>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setForm((f) => ({ ...f, preferredLocations: toggleArrayItem(f.preferredLocations, loc) }))}
                className={`text-xs font-medium px-3.5 py-2 rounded-full border ${form.preferredLocations.includes(loc)
                    ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                  }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Preferred Mode</label>
          <div className="flex flex-wrap gap-4">
            {MODES.map((m) => (
              <label key={m} className="flex items-center gap-2.5 text-sm font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.preferredMode.includes(m)}
                  onChange={() => setForm((f) => ({ ...f, preferredMode: toggleArrayItem(f.preferredMode, m) }))}
                  className="rounded border-border accent-primary w-4 h-4"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Experience Level</label>
          <select
            value={form.experienceLevel}
            onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select...</option>
            {EXPERIENCE_LEVELS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Skills</label>
          <input
            type="text"
            placeholder="e.g. React, Python, SQL"
            value={form.skills}
            onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
            className={inputClass}
          />
          <p className="text-xs text-muted-foreground mt-1">Comma-separated skills</p>
        </div>

        <div>
          <label className={labelClass}>Minimum Match Score: {form.minMatchScore}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={form.minMatchScore}
            onChange={(e) => setForm((f) => ({ ...f, minMatchScore: parseInt(e.target.value) }))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span><span>100%</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
