import { Grid, Card, CardContent, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

const theme = createTheme({
    palette: {
        primary: { main: '#0f3d3e' }, // Dark teal
        secondary: { main: '#d9af50' }, // Gold
        background: { default: '#f8fafc' }, // Light gray background
        success: { main: '#4CAF50' }, // Green for Active
        warning: { main: '#FFC107' }, // Yellow for On Hold
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        caption: { fontSize: '0.75rem' },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
    },
});

const stats = [
    {
        label: 'Active Today',
        key: 'total_active_today',
        icon: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 40, transition: 'transform 0.3s ease' }} />,
    },
    {
        label: 'On Hold Today',
        key: 'total_on_hold_today',
        icon: <PauseCircleIcon sx={{ color: 'warning.main', fontSize: 40, transition: 'transform 0.3s ease' }} />,
    },
];

export default function CardStats({ counts }) {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    animation: 'fadeIn 0.5s ease-in',
                    '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                    px: { xs: 2, sm: 4, md: 6 },
                    py: { xs: 2, sm: 3 },
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    {stats.map(({ label, key, icon }) => (
                        <Grid item xs={12} sm={6} md={4} key={label}>
                            <Card
                                sx={{
                                    minHeight: 160,
                                    minWidth: 220,
                                    '&:hover .MuiSvgIcon-root': {
                                        transform: 'scale(1.2)', // Icon scale on card hover
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        gap={1.5}
                                        sx={{ textAlign: 'center' }}
                                    >
                                        {icon}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'primary.main',
                                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: 'primary.main',
                                                fontSize: { xs: '1.5rem', sm: '2rem' },
                                            }}
                                        >
                                            {counts?.[key] ?? 0}
                                        </Typography>
                                        {counts?.date && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                }}
                                            >
                                                {counts.date}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ThemeProvider>
    );
}