import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    List,
    ListItemButton,
    ListItemText,
    ThemeProvider,
    createTheme,
    InputAdornment,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const theme = createTheme({
    palette: {
        primary: { main: "#0f3d3e" },
        secondary: { main: "#d9af50" },
        background: { default: "#f8fafc" },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontWeight: 500,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#fff",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    "&:hover": { backgroundColor: "#eef4f4" },
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        subtitle1: { fontWeight: 600 },
        body2: { fontSize: "0.875rem" },
        caption: { fontSize: "0.75rem" },
    },
});

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", severity: "error" });
    const navigate = useNavigate();

    const handleSearch = async () => {
        const trimmed = (query || "").trim();
        if (!trimmed) {
            setToast({ open: true, message: "Enter Customer ID (e.g., ARC001) or 10-digit mobile", severity: "warning" });
            return;
        }
        setLoading(true);
        setResults([]);

        try {
            const res = await api.get(
                `${import.meta.env.VITE_BACKEND_URL}/customer/${encodeURIComponent(trimmed)}`
            );
            setResults(Array.isArray(res.data) ? res.data : []);
            if (!Array.isArray(res.data) || res.data.length === 0) {
                setToast({ open: true, message: "No customers found", severity: "info" });
            }
        } catch (err) {
            setToast({
                open: true,
                message: err?.response?.data?.detail || "Search failed",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleResultClick = (customer) => {
        navigate("/customers", { state: customer });
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    bgcolor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 1, sm: 2, md: 3 },
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 360, sm: 400 },
                        borderRadius: 8,
                        overflow: "hidden",
                    }}
                >
                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: { xs: 1, sm: 1.5 },
                                alignItems: { xs: "stretch", sm: "center" },
                                justifyContent: "center",
                            }}
                        >
                            <TextField
                                size="small"
                                label="Customer ID or Mobile"
                                placeholder="ARCXXX or 98XXXXXXXX"
                                variant="outlined"
                                fullWidth
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleEnter}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": { borderColor: "primary.main" },
                                        "&.Mui-focused fieldset": { borderColor: "primary.main" },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: query && (
                                        <InputAdornment position="end">
                                            <Button
                                                sx={{
                                                    minWidth: "auto",
                                                    p: 0.5,
                                                    color: "text.secondary",
                                                    "&:hover": { color: "primary.main" },
                                                }}
                                                onClick={() => setQuery("")}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleSearch}
                                disabled={loading}
                                sx={{
                                    bgcolor: "secondary.main",
                                    color: "primary.main",
                                    "&:hover": { bgcolor: "secondary.dark" },
                                    minWidth: { xs: "100%", sm: 80 },
                                    py: 1,
                                }}
                            >
                                {loading ? <CircularProgress size={18} color="inherit" /> : "Search"}
                            </Button>
                        </Box>

                        {results.length > 0 && (
                            <Box
                                sx={{
                                    mt: 2,
                                    maxHeight: 160,
                                    overflowY: "auto",
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    borderRadius: 1,
                                    bgcolor: "#fff",
                                }}
                            >
                                <List dense disablePadding>
                                    {results.map((c, index) => (
                                        <ListItemButton
                                            key={c.customer_id || `search-${index}`}
                                            onClick={() => handleResultClick(c)}
                                            divider
                                            sx={{ py: 1.5, px: 2 }}
                                        >
                                            <ListItemText
                                                primaryTypographyProps={{
                                                    variant: "body2",
                                                    fontWeight: "bold",
                                                    color: "primary.main",
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                }}
                                                primary={`${c.customer_id || "-"} • ${c.fullname || "-"}`}
                                                secondary={`Mobile: ${c.mobile || "-"} • Reg: ${c.reg_date || "-"}`}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </Box>
                </Paper>

                <Snackbar
                    open={toast.open}
                    autoHideDuration={3500}
                    onClose={() => setToast({ ...toast, open: false })}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        severity={toast.severity}
                        variant="filled"
                        onClose={() => setToast({ ...toast, open: false })}
                        sx={{
                            maxWidth: { xs: 300, sm: 400 },
                            borderRadius: 2,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}