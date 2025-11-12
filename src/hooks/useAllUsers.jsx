// 📁 src/hooks/useAllUsers.jsx
import { useState, useEffect } from "react";
import { api } from "../components/utils/api";

export default function useAllUsers(fetch = true) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(fetch);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!fetch) return; // skip fetching when not needed
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await api.get("/users");
                setUsers(res.data || []);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError(err?.response?.data?.detail || "Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [fetch]);

    return { users, loading, error };
}