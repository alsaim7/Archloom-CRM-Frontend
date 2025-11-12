import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Backdrop,
    CircularProgress,
    Snackbar,
    Alert,
    Box,
    Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

import FilterForm from "../components/filter/FilterForm";
import FilterTable from "../components/filter/FilterTable";
import { FilterPrint } from "../components/print/FilterPrint";
import { api } from "../components/utils/api";
import useCurrentUser from "../hooks/useCurrentUser"; // ✅ added import

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Filter() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const navigate = useNavigate();

    // ✅ Fetch current user info
    const { user: currentUser, loading: userLoading, error } = useCurrentUser(backendUrl);

    const showToast = (message, severity = "success") => {
        setToast({ open: true, message, severity });
    };
    const handleToastClose = (_, reason) => {
        if (reason === "clickaway") return;
        setToast((prev) => ({ ...prev, open: false }));
    };

    // ✅ Wait for user data to load before rendering
    if (userLoading) {
        return (
            <Backdrop open sx={{ color: "#fff", zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    // ✅ Handle search/filter action
    const handleSearch = async ({ date_from, date_to, status, assigned_to_name }) => {
        try {
            setLoading(true);

            const paramsObj = {};
            if (date_from) paramsObj.date_from = date_from;
            if (date_to) paramsObj.date_to = date_to;
            if (status) paramsObj.status = status;
            if (assigned_to_name) paramsObj.assigned_to_name = assigned_to_name;

            const query = new URLSearchParams(paramsObj).toString();
            const res = await api.get(`${backendUrl}/customers/filter?${query}`);

            setTableData(Array.isArray(res.data) ? res.data : []);
            if (!res.data || res.data.length === 0) {
                showToast("No customers found for given filters", "info");
            }
        } catch (err) {
            showToast(
                err?.response?.data?.detail || "Failed to filter customers",
                "error"
            );
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Print data
    const handlePrint = () => {
        const result = FilterPrint(tableData, true);
        if (result?.noData) {
            showToast(result.message, "warning");
        }
    };

    // ✅ Navigation
    const handleGoHome = () => navigate("/");

    return (
        <Card
            sx={{
                maxWidth: "1200px",
                mx: "auto",
                mt: 4,
                borderRadius: 3,
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                bgcolor: "#f8fafc",
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleGoHome}
                    startIcon={<HomeIcon />}
                    sx={{
                        mb: 3,
                        bgcolor: "#0f3d3e",
                        color: "#fff",
                        borderRadius: 1,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        "&:hover": {
                            bgcolor: "#1a6b6c",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        },
                        transition: "all 0.2s ease",
                    }}
                >
                    Home
                </Button>

                <Backdrop
                    open={loading}
                    sx={{
                        color: "#fff",
                        zIndex: 9999,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "#0f3d3e" }}
                >
                    Filter Data
                </Typography>

                {/* ✅ Pass currentUser so the form knows if user is admin */}
                <FilterForm onSearch={handleSearch} currentUser={currentUser} />

                <FilterTable data={tableData} />

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        onClick={handlePrint}
                        sx={{
                            bgcolor: "#0f3d3e",
                            color: "#fff",
                            borderRadius: 1,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            "&:hover": {
                                bgcolor: "#1a6b6c",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            },
                            transition: "all 0.2s ease",
                        }}
                    >
                        Print
                    </Button>
                </Box>
            </CardContent>

            {/* ✅ Snackbar */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleToastClose}
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        borderRadius: 2,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        fontWeight: 500,
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}