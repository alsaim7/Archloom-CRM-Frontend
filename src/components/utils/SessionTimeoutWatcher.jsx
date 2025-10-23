import { useEffect, useRef } from "react";
import { clearToken, getToken } from "./auth";
import { useNavigate } from "react-router-dom";

// Lightweight JWT decode (no validation), only to read exp
function parseJwtExp(token) {
    try {
        const [, payload] = token.split(".");
        const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        // exp is seconds since epoch (UTC)
        return typeof json.exp === "number" ? json.exp : null;
    } catch {
        return null;
    }
}

export default function SessionTimeoutWatcher() {
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        function schedule() {
            // Clear any previous timer
            if (timerRef.current) clearTimeout(timerRef.current);

            const token = getToken();
            if (!token) return;

            const expSec = parseJwtExp(token);
            if (!expSec) {
                // If token has no exp, fall back to immediate logout for safety
                clearToken();
                navigate("/login", { replace: true });
                return;
            }

            const nowMs = Date.now();
            const expMs = expSec * 1000;
            const remaining = expMs - nowMs;

            if (remaining <= 0) {
                // Already expired
                clearToken();
                navigate("/login", { replace: true });
                return;
            }

            // Schedule logout at exp time
            timerRef.current = setTimeout(() => {
                clearToken();
                navigate("/login", { replace: true });
            }, remaining);
        }

        schedule();

        // Reschedule when tab becomes visible (handles sleep/clock skew)
        function onVisibility() {
            if (document.visibilityState === "visible") schedule();
        }
        document.addEventListener("visibilitychange", onVisibility);

        // Cleanup
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [navigate]);

    return null;
}
