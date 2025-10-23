import { useState } from "react";
import {
    ThemeProvider,
    createTheme,
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../components/utils/api"

const theme = createTheme({
    palette: {
        primary: { main: "#0f3d3e" },
        secondary: { main: "#d9af50" },
        background: { default: "#f8fafc" },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 500 },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": { borderRadius: 8, backgroundColor: "#fff" },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: "#fff",
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

const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "HOLD", label: "On Hold" },
    { value: "CLOSED", label: "Closed" },
];

export default function UpdateCustomer() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Search input and loaded record
    const [searchId, setSearchId] = useState("");
    const [record, setRecord] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        fullname: "",
        mobile: "",
        email: "",
        address: "",
        reg_date: "",
        note: "",
        status: "",
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

    const showToast = (message, severity = "success") => setToast({ open: true, message, severity });
    const handleToastClose = (_, reason) => {
        if (reason === "clickaway") return;
        setToast((p) => ({ ...p, open: false }));
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

    const handleSearch = async () => {
        const cid = (searchId || "").trim();
        if (!cid) {
            showToast("Enter a valid customer ID like ARC001", "warning");
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`${backendUrl}/find/${encodeURIComponent(cid)}`);
            const cust = res.data;
            setRecord(cust);
            setFormData({
                fullname: cust.fullname || "",
                mobile: cust.mobile || "",
                email: cust.email || "",
                address: cust.address || "",
                reg_date: cust.reg_date || "",
                note: cust.note || "",
                status: cust.status || "",
            });
            showToast("Customer loaded", "success");
        } catch (e) {
            const msg = e?.response?.data?.detail || "Customer not found";
            showToast(msg, "error");
            setRecord(null);
            setFormData({
                fullname: "",
                mobile: "",
                email: "",
                address: "",
                reg_date: "",
                note: "",
                status: "",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e?.preventDefault?.();
        if (!record?.customer_id) {
            showToast("Search and select a customer first", "warning");
            return;
        }
        if (!formData.fullname.trim()) return showToast("Full name is required.", "warning");
        if (!formData.address.trim()) return showToast("Address is required.", "warning");
        if (formData.mobile && formData.mobile.length !== 10)
            return showToast("Mobile must be exactly 10 digits or left empty.", "warning");

        setLoading(true);
        try {
            // Get current date in YYYY-MM-DD format for hold_since if status is HOLD
            const currentDate = new Date().toISOString().split("T")[0];
            // Build patch payload: exclude protected fields
            const payload = {
                fullname: formData.fullname.trim(),
                mobile: formData.mobile || null,
                email: formData.email.trim() || null,
                address: formData.address.trim(),
                note: formData.note.trim() || null,
                status: formData.status || null,
                hold_since: formData.status === "HOLD" ? currentDate : "",
            };

            const res = await api.patch(
                `${backendUrl}/customer/${encodeURIComponent(record.customer_id)}`,
                payload
            );

            const updated = res.data;
            showToast("Customer updated", "success");
            navigate("/customers", { state: updated });
        } catch (e) {
            const msg = e?.response?.data?.detail || "Failed to update customer";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (!record) {
            setFormData({
                fullname: "",
                mobile: "",
                email: "",
                address: "",
                reg_date: "",
                note: "",
                status: "",
            });
            return;
        }
        setFormData({
            fullname: record.fullname || "",
            mobile: record.mobile || "",
            email: record.email || "",
            address: record.address || "",
            reg_date: record.reg_date || "",
            note: record.note || "",
            status: record.status || "",
        });
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
                    alignItems: "flex-start",
                    justifyContent: "center",
                    py: { xs: 3, sm: 4, md: 6 },
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 420, sm: 720, md: 1100 },
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                >
                    {/* Header */}
                    <Box sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, bgcolor: "primary.main", color: "#fff" }}>
                        <Typography variant="h4" align="center" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                            Update Customer
                        </Typography>
                        <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.9 }}>
                            Search by Customer ID and update details
                        </Typography>
                    </Box>

                    {/* Search bar */}
                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#ffffff", borderBottom: "1px solid #eee" }}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "50%", justifyContent:'center', margin:'0 auto' }}>
                            <TextField
                                size="small"
                                label="Customer ID"
                                placeholder="e.g., ARC001"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                fullWidth
                                sx={{ flex: "1 1 280px", minWidth: 240 }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearch}
                                sx={{ flex: "0 0 auto", minWidth: 120 }}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>

                    {/* Form (only shown if record exists) */}
                    {record && (
                        <Box component="form" onSubmit={handleUpdate} sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#ffffff" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: { xs: 2, sm: 2 },
                                    justifyContent: "space-between",
                                    "& > :nth-of-type(1)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(25% - 12px)" } }, // Full Name
                                    "& > :nth-of-type(2)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(25% - 12px)" } }, // Mobile
                                    "& > :nth-of-type(3)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(30% - 12px)" } }, // Email
                                    "& > :nth-of-type(4)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(20% - 12px)" } }, // Registration Date (locked)
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
                                    onChange={() => { }}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    InputProps={{ readOnly: true }}
                                    disabled
                                />
                            </Box>

                            {/* Address */}
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={6}
                                />
                            </Box>

                            {/* Note */}
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

                            {/* Status */}
                            <Box sx={{ mt: 2 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        displayEmpty
                                        label="Status"
                                        renderValue={(selected) => {
                                            if (!selected) return <em>Select Status</em>;
                                            return statusOptions.find((option) => option.value === selected)?.label || selected;
                                        }}
                                    >
                                        {statusOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
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
                                    sx={{ color: "text.secondary", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                >
                                    Review details and click Update to save changes.
                                </Typography>

                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleReset}
                                        sx={{
                                            borderColor: "secondary.main",
                                            color: "secondary.main",
                                            "&:hover": { borderColor: "secondary.dark", backgroundColor: "secondary.light" },
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ "&:hover": { bgcolor: "primary.dark" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                    >
                                        Update
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleToastClose} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}