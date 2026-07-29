import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../hooks/useAuth";
import { Spinner } from "./ui/Spinner";

// Wraps routes that require a logged-in user.
// If session check is loading → show spinner.
// If not logged in → redirect to /login.
// If logged in → render children.
export function ProtectedRoute() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Inverse — if user IS logged in, redirect away from login/signup pages
export function PublicOnlyRoute() {
  const { data: user, isLoading } = useMe();
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (user) return <Navigate to="/products" replace />;
  return <Outlet />;
}
