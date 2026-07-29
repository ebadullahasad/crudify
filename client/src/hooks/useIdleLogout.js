import { useEffect } from "react";
import { useLogout } from "./useAuth";

const IDLE_LIMIT_MS = 5 * 60 * 1000; // matches backend session TTL

// Auto-logout after 5 min of inactivity (matches banking-style UX)
export function useIdleLogout(enabled = true) {
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (!enabled) return;

    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => logout(), IDLE_LIMIT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));

    const onVisibility = () => {
      if (document.visibilityState === "hidden") reset();
    };
    document.addEventListener("visibilitychange", onVisibility);

    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, logout]);
}
