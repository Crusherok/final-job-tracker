import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/saved", label: "Saved" },
  { path: "/digest", label: "Digest" },
  { path: "/settings", label: "Settings" },
  { path: "/proof", label: "Proof" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-serif text-xl font-bold text-foreground tracking-tight">
          Job Notification Tracker
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
