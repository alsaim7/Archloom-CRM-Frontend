import { useState, useEffect } from "react";
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { api } from "../components/utils/api";
import useCurrentUser from "../hooks/useCurrentUser";
import useAllUsers from "../hooks/useAllUsers";

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
    const { user: currentUser, loading: fetchingUsers, error: userError } = useCurrentUser(backendUrl);
    const { users, loading: loadingUsers, error: usersError } = useAllUsers(currentUser?.role === "admin");

    const [formData, setFormData] = useState({
        fullname: "",
        mobile: "",
        email: "",
        address: "",
        reg_date: new Date().toISOString().split('T')[0],
        assigned_to: "",
    });

    const [notes, setNotes] = useState([
        {
            date: new Date().toISOString().split('T')[0],
            note: ""
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const navigate = useNavigate();

    // Set assigned_to for non-admin users
    useEffect(() => {
        if (currentUser?.role !== "admin" && currentUser?.id) {
            setFormData(prev => ({
                ...prev,
                assigned_to: currentUser.id
            }));
        }
    }, [currentUser]);

    // Handle authentication errors
    useEffect(() => {
        if (userError) {
            console.error("User authentication error:", userError);
            showToast("Authentication error. Please login again.", "error");
        }
        if (usersError) {
            console.error("Users fetch error:", usersError);
            // Don't show toast for users fetch error as it might be expected for non-admins
        }
    }, [userError, usersError]);

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

    const handleNoteChange = (index, field, value) => {
        setNotes(prevNotes =>
            prevNotes.map((note, i) =>
                i === index ? { ...note, [field]: value } : note
            )
        );
    };

    const addNote = () => {
        setNotes(prevNotes => [
            ...prevNotes,
            {
                date: new Date().toISOString().split('T')[0],
                note: ""
            }
        ]);
    };

    const removeNote = (index) => {
        if (notes.length > 1) {
            setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
        }
    };

    const handleReset = () => {
        setFormData({
            fullname: "",
            mobile: "",
            email: "",
            address: "",
            reg_date: new Date().toISOString().split('T')[0],
            assigned_to: currentUser?.role === "admin" ? "" : currentUser?.id,
        });
        setNotes([
            {
                date: new Date().toISOString().split('T')[0],
                note: ""
            }
        ]);
    };

    const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!formData.fullname.trim()) return showToast("Full name is required.", "warning");
    if (!formData.address.trim()) return showToast("Address is required.", "warning");
    if (!formData.reg_date) return showToast("Registration date is required.", "warning");
    if (currentUser?.role === "admin" && !formData.assigned_to) {
        return showToast("Please assign a user for this customer.", "warning");
    }
    if (formData.mobile && formData.mobile.length !== 10)
        return showToast("Mobile must be exactly 10 digits or left empty.", "warning");

    // Check if user is authenticated
    if (!currentUser) {
        showToast("Please login to continue.", "error");
        return;
    }

    // Filter out empty notes and convert date strings to proper format
    const filteredNotes = notes
        .filter(note => note.note.trim() !== "")
        .map(note => ({
            ...note,
            // Ensure date is in YYYY-MM-DD format (backend expects date type)
            date: note.date // This should already be in YYYY-MM-DD format from the date input
        }));

    setLoading(true);
    try {
        const payload = {
            fullname: formData.fullname.trim(),
            mobile: formData.mobile || null,
            email: formData.email.trim() || null,
            address: formData.address.trim(),
            reg_date: formData.reg_date,
            notes: filteredNotes, // Send as array, even if empty
            assigned_to: currentUser?.role === "admin" ? formData.assigned_to : currentUser?.id,
        };

        // Debug: log what we're sending
        console.log("Submitting payload:", JSON.stringify(payload, null, 2));

        const res = await api.post(`${backendUrl}/customers`, payload);

        const saved = res.data;
        setLoading(false);
        showToast(`Customer saved!\nCustomer ID: ${saved.customer_id}\nName: ${saved.fullname}`, "success");

        navigate('/customers', { state: res.data });
    } catch (e) {
        setLoading(false);
        console.error("Submission error:", e);
        console.error("Error response:", e.response?.data);
        
        if (e?.response?.status === 401) {
            showToast("Session expired. Please login again.", "error");
            return;
        }
        
        // More detailed error handling
        if (e?.response?.status === 500) {
            const errorDetail = e.response?.data?.detail;
            if (errorDetail === "Failed to create customer") {
                showToast("Failed to create customer. Please check the data and try again.", "error");
            } else {
                showToast("Server error. Please try again later.", "error");
            }
            return;
        }
        
        const msg = e?.response?.data?.detail
            ? Array.isArray(e.response.data.detail)
                ? e.response.data.detail.map((d) => d.msg).join("\n")
                : e.response.data.detail
            : "Something went wrong. Please try again.";
        showToast(msg, "error");
    }
};

    // Check if user is non-admin (employee)
    const isNonAdmin = currentUser?.role !== "admin";

    // Show loading state while checking authentication
    if (fetchingUsers) {
        return (
            <ThemeProvider theme={theme}>
                <Backdrop open={true} sx={{ color: "#fff", zIndex: 1300 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </ThemeProvider>
        );
    }

    // Show error state if authentication failed
    if (userError && !currentUser) {
        return (
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        minHeight: "100vh",
                        bgcolor: "background.default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                    }}
                >
                    <Paper sx={{ p: 4, textAlign: "center" }}>
                        <Typography color="error" sx={{ mb: 2 }}>
                            Authentication Error
                        </Typography>
                        <Typography sx={{ mb: 3 }}>
                            Please login to access customer registration.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </Button>
                    </Paper>
                </Box>
            </ThemeProvider>
        );
    }

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
                                "& > :nth-of-type(1)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(25% - 12px)" } },
                                "& > :nth-of-type(2)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(25% - 12px)" } },
                                "& > :nth-of-type(3)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(30% - 12px)" } },
                                "& > :nth-of-type(4)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(20% - 12px)" } },
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

                        {/* Second row: Assigned To (for admin only) */}
                        {currentUser?.role === "admin" && (
                            <Box sx={{ mt: 2 }}>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel>Assigned To</InputLabel>
                                    <Select
                                        name="assigned_to"
                                        value={formData.assigned_to}
                                        onChange={handleChange}
                                        label="Assigned To"
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.name} ({user.email}) - {user.role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

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

                        {/* Dynamic Notes Section */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                                Notes
                            </Typography>

                            {notes.map((noteItem, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "flex-start",
                                        mb: 2,
                                        flexWrap: { xs: "wrap", sm: "nowrap" },
                                    }}
                                >
                                    <TextField
                                        type="date"
                                        label="Date"
                                        value={noteItem.date}
                                        onChange={(e) => handleNoteChange(index, "date", e.target.value)}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            flex: { xs: "1 1 100%", sm: "0 0 150px" },
                                            minWidth: { xs: "100%", sm: "150px" }
                                        }}
                                    />
                                    <TextField
                                        label="Note"
                                        value={noteItem.note}
                                        onChange={(e) => handleNoteChange(index, "note", e.target.value)}
                                        fullWidth
                                        multiline
                                        minRows={1}
                                        maxRows={3}
                                        size="small"
                                        sx={{ flex: 1 }}
                                    />
                                    <IconButton
                                        onClick={() => removeNote(index)}
                                        color="error"
                                        size="small"
                                        disabled={notes.length === 1}
                                        sx={{
                                            mt: { xs: 0, sm: 0.5 },
                                            flex: { xs: "0 0 auto", sm: "0 0 auto" }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button
                                type="button"
                                variant="outlined"
                                color="primary"
                                onClick={addNote}
                                sx={{ mt: 1 }}
                            >
                                Add Note
                            </Button>
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