import { useState } from "react";
import { CustomerPrint } from "../components/print/CustomerPrint";
import {
    Box,
    Typography,
    Divider,
    Card,
    CardContent,
    Button,
    Alert,
    CircularProgress,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

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
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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

export default function Customers() {
    const { state: customer } = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePrint = async () => {
        if (!customer) {
            setError("No customer data to print");
            return;
        }
        try {
            setLoading(true);
            CustomerPrint(customer, true); // Download PDF
        } catch (e) {
            // console.log(e)
            setError("Failed to generate PDF");
        } finally {
            setLoading(false);
        }
    };


    if (!customer) {
        return (
            <ThemeProvider theme={theme}>
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

                    <Typography
                        variant="h6"
                        textAlign="center"
                        sx={{ color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                        No customer data available.
                    </Typography>
                </Box>
            </ThemeProvider>
        );
    }

    // console.log(customer);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    py: { xs: 3, sm: 4, md: 6 },
                    px: { xs: 2, sm: 3, md: 4 },
                    '@media print': { minHeight: "auto", py: 0, px: 0 }
                }}
            >
                <Box maxWidth={{ xs: 400, sm: 600, md: 1000 }} mx="auto">
                    <Typography
                        variant="h4"
                        textAlign="center"
                        fontWeight="bold"
                        sx={{ color: "primary.main", mb: 3, fontSize: { xs: "1.5rem", sm: "2rem" } }}
                    >
                        Customer Details
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        variant="contained"
                        className="no-print"
                        onClick={() => navigate(-1)}
                        sx={{
                            mb: 3,
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                    >
                        Back
                    </Button>

                    <Card
                        className="print-card"
                        sx={{
                            borderLeft: "4px solid",
                            borderColor: "primary.main",
                            bgcolor: "#ffffff",
                            borderRadius: 8,
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: { xs: 2, sm: 2 },
                                    justifyContent: "space-between",
                                    // Primary fields (Name, Customer ID, Status) - wider
                                    "& > :nth-of-type(1)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(30% - 12px)" } }, // Name
                                    "& > :nth-of-type(2)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(30% - 12px)" } }, // Customer ID
                                    "& > :nth-of-type(3)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(30% - 12px)" } }, // Status
                                    // Secondary fields (Mobile, Email, Registration Date) - standard
                                    "& > :nth-of-type(4)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(20% - 12px)" } }, // Mobile
                                    "& > :nth-of-type(5)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(20% - 12px)" } }, // Email
                                    "& > :nth-of-type(6)": { flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(20% - 12px)" } }, // Registration Date
                                    // Full-width fields (Address, Note)
                                    "& > :nth-of-type(7)": { flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 100%" } }, // Address
                                    "& > :nth-of-type(8)": { flex: { xs: "1 1 100%", sm: "1 1 100%", md: "1 1 100%" } }, // Note
                                    minWidth: 0,
                                }}
                            >
                                {/* 1. Name (Priority 1) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Name:
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                        {customer.fullname}
                                    </Typography>
                                </Box>

                                {/* 2. Customer ID (Priority 2) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Customer ID:
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                        {customer.customer_id}
                                    </Typography>
                                </Box>

                                {/* 3. Status (Priority 3) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Status:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                            color:
                                                customer.status === "ACTIVE"
                                                    ? "success.main"
                                                    : customer.status === "HOLD"
                                                        ? "warning.main" // yellow
                                                        : customer.status === "CLOSED"
                                                            ? "error.main" // red
                                                            : "text.primary",
                                        }}
                                    >
                                        {customer.status === 'HOLD' ? customer.status + ' ' + `(${customer.hold_since})` : customer.status}

                                    </Typography>
                                </Box>

                                {/* 4. Mobile (Priority 4) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Mobile:
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                        {customer.mobile || "-"}
                                    </Typography>
                                </Box>

                                {/* 5. Email (Priority 5) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Email:
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                        {customer.email || "-"}
                                    </Typography>
                                </Box>

                                {/* 6. Registration Date (Priority 6) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Registration Date:
                                    </Typography>
                                    <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                        {customer.reg_date}
                                    </Typography>
                                </Box>

                                {/* 7. Address (Full-width, Priority 7) */}
                                <Box>
                                    <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                        Address:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            whiteSpace: "pre-wrap",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        {customer.address}
                                    </Typography>
                                </Box>

                                {/* 8. Note (Full-width, Priority 8) */}
                                {/* 8. Notes (Full-width, Priority 8) */}
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        fontWeight="bold"
                                        sx={{
                                            fontSize: { xs: "0.875rem", sm: "1rem" },
                                            mb: 1,
                                            color: "primary.main"
                                        }}
                                    >
                                        Remarks / Notes:
                                    </Typography>

                                    {customer.notes && customer.notes.length > 0 ? (
                                        // Sort descending (latest first)
                                        [...customer.notes]
                                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                                            .map((entry, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        mb: 1.5,
                                                        p: 1.5,
                                                        border: "1px solid #e0e0e0",
                                                        borderRadius: 2,
                                                        bgcolor: "#fafafa",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "text.secondary",
                                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {new Date(entry.date).toLocaleDateString("en-CA")} {/* YYYY-MM-DD */}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            whiteSpace: "pre-wrap",
                                                            mt: 0.5,
                                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                                        }}
                                                    >
                                                        {entry.note || "-"}
                                                    </Typography>
                                                </Box>
                                            ))
                                    ) : (
                                        <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, color: "text.secondary" }}>
                                            No notes available
                                        </Typography>
                                    )}
                                </Box>


                                {/* 8. Assigned To (Full-width, Priority 8) */}
                               
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >

                                {customer.assigned_to_name?
                                    <Box>
                                        <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                            Assigned To: {customer.assigned_to_name || "-"}
                                        </Typography>
                                        {/* <Typography
                                        sx={{
                                            whiteSpace: "pre-wrap",
                                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                        }}
                                    >
                                        
                                    </Typography> */}
                                    </Box>
                                :
                                    <Box>
                            
                                    </Box>
                                }
                                

                                <Button
                                    variant="contained"
                                    onClick={handlePrint}
                                    className="no-print"
                                    sx={{
                                        bgcolor: "secondary.main",
                                        color: "primary.main",
                                        "&:hover": { bgcolor: "secondary.dark" },
                                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    }}
                                    size="small"
                                >
                                    Print
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    {loading && (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
                            <CircularProgress color="primary" />
                        </Box>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}