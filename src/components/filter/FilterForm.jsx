import { useState } from "react";
import { Box, TextField, MenuItem, Button, Typography } from "@mui/material";

const statusOptions = [
    { value: "", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "HOLD", label: "On Hold" },
    { value: "CLOSED", label: "Closed" },
];

export default function FilterForm({ onSearch }) {
    const [formValues, setFormValues] = useState({
        date_from: "",
        date_to: "",
        status: "",
    });

    const handleChange = (e) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        onSearch(formValues);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            mb={3}
            // sx={{
            //     animation: "fadeIn 0.5s ease-in",
            //     "@keyframes fadeIn": {
            //         from: { opacity: 0, transform: "translateY(10px)" },
            //         to: { opacity: 1, transform: "translateY(0)" },
            //     },
            // }}
        >
            <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 700, color: "#0f3d3e" }}
            >
                Filter Customers
            </Typography>

            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                }}
                gap={2}
                mb={3}
            >
                <TextField
                    type="date"
                    label="From Date"
                    name="date_from"
                    value={formValues.date_from}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    sx={{
                        bgcolor: "#f8fafc",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#0f3d3e" },
                            "&:hover fieldset": { borderColor: "#1a6b6c" },
                            "&.Mui-focused fieldset": { borderColor: "#1a6b6c" },
                        },
                    }}
                />
                <TextField
                    type="date"
                    label="To Date"
                    name="date_to"
                    value={formValues.date_to}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    sx={{
                        bgcolor: "#f8fafc",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#0f3d3e" },
                            "&:hover fieldset": { borderColor: "#1a6b6c" },
                            "&.Mui-focused fieldset": { borderColor: "#1a6b6c" },
                        },
                    }}
                />
                <TextField
                    select
                    label="Status"
                    name="status"
                    value={formValues.status}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{
                        bgcolor: "#f8fafc",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#0f3d3e" },
                            "&:hover fieldset": { borderColor: "#1a6b6c" },
                            "&.Mui-focused fieldset": { borderColor: "#1a6b6c" },
                        },
                    }}
                >
                    {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box display="flex" gap={2}>
                <Button
                    type="submit"
                    variant="contained"
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
                    Search
                </Button>
                <Button
                    type="button"
                    variant="outlined"
                    sx={{
                        borderColor: "#0f3d3e",
                        color: "#0f3d3e",
                        borderRadius: 1,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        "&:hover": {
                            borderColor: "#1a6b6c",
                            color: "#1a6b6c",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        },
                        transition: "all 0.2s ease",
                    }}
                    onClick={() =>
                        setFormValues({ date_from: "", date_to: "", status: "" })
                    }
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
}