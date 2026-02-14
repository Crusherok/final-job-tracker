import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}
