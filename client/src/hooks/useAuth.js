import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as authApi from "../api/auth";

// Read the non-httpOnly "crudify_user" cookie set by the backend.
// Returns { id, name, email } if logged in, else null.
export function readUserFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)crudify_user=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

// Reactive "who am I?" — reads the cookie synchronously (no API call).
// React Query is used only so we can invalidate after login/logout mutations
// and every mounted useMe() re-renders with fresh cookie state.
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: readUserFromCookie,
    initialData: readUserFromCookie,
    staleTime: Infinity, // cookie is the source of truth, no refetch
  });
}

export function useSignup() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      toast.success("Account created — please log in");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Signup failed");
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Backend already set both cookies; force useMe() to re-read
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success(`Welcome, ${data.user.name}`);
      navigate("/products");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Login failed");
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    // Runs on both success AND error — always clear local state even if
    // the API call fails (network dead, session already gone, etc.)
    onSettled: () => {
      // Belt: backend already cleared cookies on success. Suspenders: clear
      // locally in case backend was unreachable so UI stays consistent.
      document.cookie = "crudify_user=; max-age=0; path=/";
      qc.setQueryData(["me"], null);
      qc.removeQueries({ queryKey: ["products"] });
      toast.success("Logged out");
      navigate("/login");
    },
  });
}
