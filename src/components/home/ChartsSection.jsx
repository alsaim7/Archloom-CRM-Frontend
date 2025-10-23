import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, Typography, Box, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: { main: '#0f3d3e' }, // Dark teal
        secondary: { main: '#d9af50' }, // Gold
        background: { default: '#f8fafc' }, // Light gray background
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: { fontWeight: 700 }, // Normal font (Inter/Roboto)
        body2: { fontSize: '0.875rem' },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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

const chartMappings = [
    { key: 'ACTIVE', label: 'Active Customers', color: '#4CAF50' }, // Green
    { key: 'OnHold', label: 'On Hold Customers', color: '#FFC107' }, // Yellow
];

export default function ChartsSection({ graphs }) {
    return (
        <ThemeProvider theme={theme}>
            <Box
                display="flex"
                flexDirection="column"
                gap={3}
                sx={{
                    px: { xs: 2, sm: 4, md: 8 },
                    py: { xs: 2, sm: 3 },
                    width: '100%',
                    animation: 'fadeIn 0.5s ease-in',
                    '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                {chartMappings.map(({ key, label, color }) => {
                    // Fallback data for debugging
                    const xAxisData = graphs?.[key]?.dates_x_axis?.length
                        ? graphs[key].dates_x_axis
                        : ['No Data'];
                    const yAxisData = graphs?.[key]?.dates_y_axis?.length
                        ? graphs[key].dates_y_axis
                        : [0];

                    return (
                        <Card key={key} sx={{ width: '100%' }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textAlign: 'left',
                                        color: 'primary.main',
                                        mb: 2,
                                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                    }}
                                >
                                    {label} (Last 30 Days)
                                </Typography>
                                <LineChart
                                    xAxis={[
                                        {
                                            data: xAxisData,
                                            scaleType: 'band',
                                            tickNumber: Math.min(xAxisData.length, 15),
                                        },
                                    ]}
                                    series={[
                                        {
                                            data: yAxisData,
                                            label,
                                            color,
                                            area: true,
                                            showMark: false,
                                            curve: 'catmullRom',
                                        },
                                    ]}
                                    height={300}
                                    margin={{ top: 20, right: 30, bottom: 80, left: 50 }}
                                    grid={{ vertical: false, horizontal: true }}
                                    sx={{
                                        '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                                            transform: 'rotate(60deg)',
                                            textAnchor: 'start',
                                            fontSize: 10,
                                            fontFamily: theme.typography.fontFamily,
                                            fill: '#0f3d3e',
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </ThemeProvider>
    );
}