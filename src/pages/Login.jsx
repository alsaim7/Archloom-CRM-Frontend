import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
    ThemeProvider,
    createTheme,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { api } from "../components/utils/api";
import { setToken } from "../components/utils/auth";
import { LogoBase64 } from "../components/logo"; // Assuming same logo import as FilterPrint.js

const theme = createTheme({
    palette: {
        primary: { main: "#0f3d3e" }, // Dark teal
        secondary: { main: "#d9af50" }, // Gold
        background: { default: "#f8fafc" }, // Light gray background
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        "&:hover fieldset": { borderColor: "#d9af50" },
                        "&.Mui-focused fieldset": { borderColor: "#0f3d3e" },
                    },
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: { fontWeight: 700 },
        body2: { fontSize: "0.875rem" },
    },
});

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const showToast = (message, severity = "info") => setToast({ open: true, message, severity });

    const handleToastClose = (_, reason) => {
        if (reason === "clickaway") return;
        setToast((p) => ({ ...p, open: false }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return showToast("Enter email and password", "warning");
        setLoading(true);
        try {
            const res = await api.post("/login", { email, password });
            const token = res.data?.access_token;
            if (!token) throw new Error("Invalid token response");
            setToken(token);
            showToast("Logged in", "success");
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.detail || "Login failed";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1300 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: { xs: 3, sm: 4, md: 6 },
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 360, sm: 420, md: 480 },
                        borderRadius: 3,
                        p: { xs: 2, sm: 3, md: 4 },
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        animation: "fadeIn 0.5s ease-in",
                        "@keyframes fadeIn": {
                            from: { opacity: 0, transform: "translateY(10px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <img
                            src={LogoBase64}
                            alt="Logo"
                            style={{ width: 100, height: 100, objectFit: "contain" }}
                        />
                    </Box>
                    {/* Header */}
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ mb: 1, color: "primary.main", fontWeight: 700 }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ mb: 3, color: "text.secondary", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                        Sign in to manage customer records
                    </Typography>
                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            InputLabelProps={{ style: { color: "#0f3d3e" } }}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            InputLabelProps={{ style: { color: "#0f3d3e" } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{ color: "primary.main" }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{
                                bgcolor: "primary.main",
                                "&:hover": { bgcolor: "primary.dark" },
                                py: 1,
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                setEmail("");
                                setPassword("");
                            }}
                            disabled={loading}
                            sx={{
                                borderColor: "secondary.main",
                                color: "secondary.main",
                                "&:hover": {
                                    borderColor: "secondary.dark",
                                    backgroundColor: "secondary.light",
                                },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Paper>
                <Snackbar
                    open={toast.open}
                    autoHideDuration={3500}
                    onClose={handleToastClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleToastClose}
                        severity={toast.severity}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}