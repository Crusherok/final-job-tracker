import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="heading-display mb-6 max-w-2xl">
        Stop Missing The Right Jobs.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
        Precision-matched job discovery delivered daily at 9AM.
      </p>
      <Link
        to="/settings"
        className="inline-block px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium text-base hover:opacity-90 transition-opacity"
      >
        Start Tracking
      </Link>
    </div>
  );
}
