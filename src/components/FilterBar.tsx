import { LOCATIONS, MODES, EXPERIENCE_LEVELS, SOURCES } from "@/lib/preferences";
import { ALL_STATUSES, type JobStatus } from "@/lib/jobStatus";

interface FilterBarProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  mode: string;
  onModeChange: (v: string) => void;
  experience: string;
  onExperienceChange: (v: string) => void;
  source: string;
  onSourceChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  showOnlyMatches: boolean;
  onShowOnlyMatchesChange: (v: boolean) => void;
  hasPreferences: boolean;
}

export default function FilterBar(props: FilterBarProps) {
  const selectClass = "text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground";
  const inputClass = "text-sm border border-border rounded-md px-3 py-2 bg-card text-foreground";

  return (
    <div className="premium-card mb-6">
      <div className="flex flex-wrap gap-2.5 items-center justify-center">
        <input
          type="text"
          placeholder="Search title or company..."
          value={props.keyword}
          onChange={(e) => props.onKeywordChange(e.target.value)}
          className={`${inputClass} min-w-[200px] max-w-[340px]`}
        />

        <select value={props.location} onChange={(e) => props.onLocationChange(e.target.value)} className={selectClass}>
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <select value={props.mode} onChange={(e) => props.onModeChange(e.target.value)} className={selectClass}>
          <option value="">All Modes</option>
          {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select value={props.experience} onChange={(e) => props.onExperienceChange(e.target.value)} className={selectClass}>
          <option value="">All Experience</option>
          {EXPERIENCE_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>

        <select value={props.source} onChange={(e) => props.onSourceChange(e.target.value)} className={selectClass}>
          <option value="">All Sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={props.statusFilter} onChange={(e) => props.onStatusFilterChange(e.target.value)} className={selectClass}>
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={props.sort} onChange={(e) => props.onSortChange(e.target.value)} className={selectClass}>
          <option value="latest">Latest</option>
          <option value="score">Match Score</option>
          <option value="salary">Salary</option>
        </select>

        {props.hasPreferences && (
          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap px-3 py-2">
            <div className="relative inline-block w-11 h-6">
              <input
                type="checkbox"
                checked={props.showOnlyMatches}
                onChange={(e) => props.onShowOnlyMatchesChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <span className="text-sm font-medium text-foreground select-none">Only matches</span>
          </label>
        )}
      </div>
    </div>
  );
}
