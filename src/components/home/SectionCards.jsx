import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";

export default function SectionCards() {
    const sections = [
        {
            label: "Registration",
            to: "/registration",
            icon: <PersonAddIcon sx={{ fontSize: 40, color: "primary.main" }} />,
        },
        {
            label: "Filter",
            to: "/filter",
            icon: <FilterAltOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
        },
        {
            label: "Update Customer",
            to: "/updatecustomer",
            icon: <EditNoteIcon sx={{ fontSize: 40, color: "primary.main" }} />,
        },
    ];

    return (
        <Box sx={{ textAlign: "center" }}>
            <Grid container spacing={2} justifyContent="center">
                {sections.map(({ label, to, icon }, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`${label}-${index}`}>
                        <Card
                            sx={{
                                minHeight: 160,
                                minWidth: 200,
                                transition: "transform 0.2s, box-shadow 0.2s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                                },
                            }}
                        >
                            <CardActionArea component={Link} to={to}>
                                <CardContent sx={{ py: 3 }}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        gap={1.5}
                                    >
                                        {icon}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 500,
                                                color: "primary.main",
                                                fontSize: { xs: "1rem", sm: "1.125rem" },
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}