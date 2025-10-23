import { useState } from "react";
import {
    ThemeProvider,
    createTheme,
} from "@mui/material/styles";
import {
    Box,
    TextField,
    Button,
    Typography,
    Backdrop,
    CircularProgress,
    Snackbar,
    Alert,
    Paper,
    Divider,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { use } from "react";
import HomeIcon from "@mui/icons-material/Home";
import {api} from "../components/utils/api"


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
                }
            }
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
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        body2: { fontSize: "0.875rem" },
    },
});

export default function Registration() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        fullname: "",
        mobile: "",
        email: "",
        address: "",
        reg_date: "",
        note: "",
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const navigate = useNavigate()

    const showToast = (message, severity = "success") => {
        setToast({ open: true, message, severity });
    };

    const handleToastClose = (_, reason) => {
        if (reason === "clickaway") return;
        setToast((prev) => ({ ...prev, open: false }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobile") {
            const digits = value.replace(/\D/g, "");
            setFormData((p) => ({ ...p, mobile: digits }));
            return;
        }
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleReset = () => {
        setFormData({
            fullname: "",
            mobile: "",
            email: "",
            address: "",
            reg_date: "",
            note: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.fullname.trim()) return showToast("Full name is required.", "warning");
        if (!formData.address.trim()) return showToast("Address is required.", "warning");
        if (!formData.reg_date) return showToast("Registration date is required.", "warning");
        if (formData.mobile && formData.mobile.length !== 10)
            return showToast("Mobile must be exactly 10 digits or left empty.", "warning");

        setLoading(true);
        try {
            const payload = {
                fullname: formData.fullname.trim(),
                mobile: formData.mobile || null,
                email: formData.email.trim() || null,
                address: formData.address.trim(),
                reg_date: formData.reg_date,
                note: formData.note.trim() || null,
            };

            const res = await api.post(`${backendUrl}/customers`, payload);

            const saved = res.data;
            setLoading(false);
            showToast(`Customer saved!\nCustomer ID: ${saved.customer_id}\nName: ${saved.fullname}`, "success");

            navigate('/customers', { state: res.data })
        } catch (e) {
            setLoading(false);
            const msg = e?.response?.data?.detail
                ? Array.isArray(e.response.data.detail)
                    ? e.response.data.detail.map((d) => d.msg).join("\n")
                    : e.response.data.detail
                : "Something went wrong. Please try again.";
            showToast(msg, "error");
        }
    };

    const handleGoHome = () => navigate("/");

    return (
        <ThemeProvider theme={theme}>
            <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1300 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                startIcon={<HomeIcon />}
                sx={{
                    mt: 4,
                    ml:4,
                    backgroundColor: "#0f3d3e",
                    "&:hover": { backgroundColor: "#0c3334" },
                }}
            >
                Home
            </Button> */}

            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: { xs: 3, sm: 4, md: 4 },
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >

                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 400, sm: 600, md: 1000 },
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Header */}
                    <Box sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, bgcolor: "primary.main", color: "#fff" }}>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                        >
                            Customer Registration
                        </Typography>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ mt: 1, opacity: 0.9 }}
                        >
                            Fill in the customer details below
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#ffffff" }}
                    >
                        {/* First row: Name, Mobile, Email, Date */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: { xs: 2, sm: 2 },
                                justifyContent: "space-between",
                                "& > :nth-of-type(1)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(25% - 12px)" } }, // Full Name
                                "& > :nth-of-type(2)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(25% - 12px)" } }, // Mobile
                                "& > :nth-of-type(3)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(30% - 12px)" } }, // Email (wider)
                                "& > :nth-of-type(4)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(20% - 12px)" } }, // Date (narrower)
                                minWidth: 0,
                            }}
                        >
                            <TextField
                                label="Full Name"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Mobile (10 digits)"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ inputMode: "numeric", maxLength: 10 }}
                                size="small"
                            />
                            <TextField
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                type="date"
                                label="Registration Date"
                                name="reg_date"
                                value={formData.reg_date}
                                onChange={handleChange}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Box>

                        {/* Address full row */}
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                fullWidth
                                multiline
                                minRows={1}
                                maxRows={6}
                            />
                        </Box>

                        {/* Remark/Note full row */}
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Remarks / Notes"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={8}
                            />
                        </Box>

                        {/* Footer action bar */}
                        <Divider sx={{ my: 3 }} />
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                }}
                            >
                                Please review all details before submitting.
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleReset}
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
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        "&:hover": {
                                            bgcolor: "primary.dark",
                                        },
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>

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
                        width: "100%",
                        maxWidth: { xs: 300, sm: 400, md: 600 },
                        borderRadius: 2,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}