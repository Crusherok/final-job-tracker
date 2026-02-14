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
  const selectClass = "text-sm border border-border rounded-md px-2 py-1.5 bg-card text-foreground";

  return (
    <div className="premium-card mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search title or company..."
          value={props.keyword}
          onChange={(e) => props.onKeywordChange(e.target.value)}
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-card text-foreground min-w-[200px] flex-1"
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
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={props.showOnlyMatches}
              onChange={(e) => props.onShowOnlyMatchesChange(e.target.checked)}
              className="rounded border-border"
            />
            Only matches
          </label>
        )}
      </div>
    </div>
  );
}
