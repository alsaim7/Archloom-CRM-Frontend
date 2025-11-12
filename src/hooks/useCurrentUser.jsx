import { useState, useEffect } from "react";
import { api } from "../components/utils/api";
import { getToken } from "../components/utils/auth";
import { decodeToken } from "../components/utils/decodeToken";

export default function useCurrentUser(backendUrl) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        // Step 1: Decode token immediately (for quick UI display)
        const decoded = decodeToken(token);
        if (decoded) setUser(decoded);

        // Step 2: Fetch verified user info from backend /me
        const fetchUser = async () => {
            try {
                const response = await api.get(`${backendUrl}/me`);
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch /me:", err);
                setError("Failed to load user info");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [backendUrl]);

    return { user, loading, error };
}