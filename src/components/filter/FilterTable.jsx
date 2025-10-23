import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FilterTable({ data = [] }) {
    const navigate = useNavigate();

    if (!data || data.length === 0) {
        return (
            <Typography
                variant="body1"
                sx={{ color: "#0f3d3e", textAlign: "center", py: 2 }}
            >
                No data available.
            </Typography>
        );
    }

    const columns = [
        { key: "customer_id", label: "Customer ID" },
        { key: "fullname", label: "Name" },
        { key: "reg_date", label: "Registration Date" },
        { key: "mobile", label: "Mobile" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
        { key: "hold_since", label: "Hold Since" },
    ];

    const handleRowClick = (row) => {
        navigate("/customers", { state: row });
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                overflowX: "auto",
                width: "100%",
                maxHeight: "60vh",
                borderRadius: 2,
                border: "1px solid #e0e7e9",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                animation: "fadeIn 0.5s ease-in",
                "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            <Table sx={{ minWidth: 900 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#0f3d3e" }}>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                    borderBottom: "2px solid #1a6b6c",
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, idx) => (
                        <TableRow
                            key={row.customer_id || idx}
                            onClick={() => handleRowClick(row)}
                            sx={{
                                backgroundColor:
                                    row.status === "HOLD"
                                        ? "#fff3cd" // Soft yellow for HOLD
                                        : row.status === "CLOSED"
                                            ? "#f8d7da" // Soft red for CLOSED
                                            : idx % 2 === 0
                                                ? "#ffffff" // Default white for even rows
                                                : "#f8fafc", // Default light gray for odd rows
                                "&:hover": {
                                    backgroundColor:
                                        row.status === "HOLD"
                                            ? "#ffebc6" // Slightly darker yellow on hover
                                            : row.status === "CLOSED"
                                                ? "#f4c4c8" // Slightly darker red on hover
                                                : "#eef4f4", // Default hover color
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                },
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                            }}
                        >
                            {columns.map((col) => {
                                let value = row[col.key];

                                if (col.key === "address" || col.key === "note") {
                                    value = value || "-";
                                }
                                if (col.key === "email") {
                                    value = value || "-";
                                }
                                if (col.key === "mobile") {
                                    value = value || "-";
                                }
                                if (col.key === "hold_since") {
                                    value = value || "-";
                                }

                                return (
                                    <TableCell
                                        key={col.key}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            fontSize: "0.95rem",
                                            color: "#0f3d3e",
                                            borderBottom: "1px solid #e0e7e9",
                                        }}
                                    >
                                        {value}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}