import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true, // sends session cookie cross-origin
  headers: { "Content-Type": "application/json" },
});

// Global 401 handler — session expired or user got logged out server-side.
// Clear the display cookie (belt) and redirect to login (suspenders).
// Skip 401s coming from /auth/login itself (that's just "wrong password").
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url ?? "";
    const isLoginAttempt = url.includes("/auth/login");

    if (status === 401 && !isLoginAttempt) {
      document.cookie = "crudify_user=; max-age=0; path=/";
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);
