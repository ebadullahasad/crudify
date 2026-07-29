import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useIdleLogout } from "../hooks/useIdleLogout";

export function AppLayout() {
  // Auto-logout after 5 min of inactivity (matches backend session TTL)
  useIdleLogout(true);

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
