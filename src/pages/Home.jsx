import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, ThemeProvider, createTheme, CircularProgress, Alert, Card, Divider } from '@mui/material';
import SectionCards from '../components/home/SectionCards';
import Search from '../components/home/Search';
import ChartsSection from '../components/home/ChartsSection';
import CardStats from '../components/home/CardStats';
import { api } from '../components/utils/api';
import logo from '../assets/logo.png'; // Same logo as Appbar.jsx, Footer.jsx
import { decodeToken } from '../components/utils/decodeToken';
import { getToken } from '../components/utils/auth';

const theme = createTheme({
    palette: {
        primary: { main: '#0f3d3e' }, // Dark teal
        secondary: { main: '#d9af50' }, // Gold
        background: { default: '#f8fafc' }, // Light gray background
        success: { main: '#4CAF50' }, // Green for CardStats
        warning: { main: '#FFC107' }, // Yellow for CardStats
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 500 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fbfc 100%)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    // '&:hover': {
                    //     transform: 'translateY(-6px)',
                    //     boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)',
                    // },
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: { color: '#d9af50' }, // Gold for loading spinner
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '1rem',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(15, 61, 62, 0.1)',
                    margin: '24px 0',
                    borderWidth: '1px',
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700, fontFamily: '"Cinzel Decorative", serif', letterSpacing: '0.5px' },
        h5: { fontWeight: 700, fontFamily: '"Cinzel Decorative", serif', letterSpacing: '0.5px' },
        body2: { fontSize: '0.9rem', lineHeight: 1.6 },
    },
});

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState('');
    const [counts, setCounts] = useState(null);
    const [graphs, setGraphs] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setErrMsg('');

                const res = await api.get('/customers/count_and_graph');
                const data = res.data;

                if (!mounted) return;
                setCounts(data?.count ?? null);
                setGraphs(data?.graph ?? null);
            } catch (e) {
                if (!mounted) return;
                const msg =
                    e?.response?.data?.detail ||
                    e?.message ||
                    'Failed to load dashboard';
                setErrMsg(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const hasData = useMemo(() => Boolean(counts && graphs), [counts, graphs]);

    const userData = decodeToken(getToken());

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    py: { xs: 4, sm: 6, md: 8 },
                    px: { xs: 2, sm: 4, md: 6 },
                }}
            >
                <Card
                    sx={{
                        maxWidth: { xs: 400, sm: 600, md: 1000 },
                        mx: 'auto',
                        p: { xs: 3, sm: 4 },
                        bgcolor: 'background.default',
                        borderRadius: 16,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            py: 4,
                            px: { xs: 3, sm: 4 },
                            // bgcolor: 'linear-gradient(135deg, #0f3d3e 0%, #1e4b4c 80%)',
                            bgcolor: 'primary.main',
                            color: 'primary.main',
                            borderRadius: 12,
                            mb: 4,
                            textAlign: 'center',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'transform 0.3s ease',
                            // '&:hover': {
                            //     transform: 'scale(1.02)',
                            // },
                        }}
                    >
                        <img
                            src={logo}
                            alt="Archloom Logo"
                            style={{ height: 70, width: 'auto' }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'secondary.main',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                                letterSpacing: '1px',
                            }}
                        >
                            Archloom Dashboard
                        </Typography>
                        {userData?.name && (
                            <Typography
                                variant="h4"
                                sx={{
                                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                                    fontWeight: 900,
                                    fontFamily: '"Cinzel Decorative", serif',
                                    color: 'secondary.main', // Gold color to stand out
                                    opacity: 0.9,
                                    letterSpacing: '0.5px',
                                    lineHeight: 1.4,
                                    px: { xs: 1, sm: 2 },
                                    maxWidth: '90%',
                                }}
                            >
                                Welcome, {userData.name}!
                            </Typography>
                        )}
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                opacity: 0.85,
                                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                maxWidth: '80%',
                                color: 'secondary.main',
                            }}
                        >
                            Seamlessly manage your customers with powerful insights
                        </Typography>
                    </Box>

                    {/* Search */}
                    <Box
                        sx={{
                            mb: { xs: 3, sm: 4 },
                            px: { xs: 1, sm: 2, md: 3 },
                            width: { xs: '100%', sm: '90%', md: '80%' },
                            maxWidth: { xs: 360, sm: 400, md: 600 },
                            mx: 'auto',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s ease',
                            // '&:hover': { transform: 'scale(1.01)' },
                        }}
                    >
                        <Search />
                    </Box>

                    <Divider />

                    {/* Quick Actions */}
                    <Box sx={{ mt: 4, mb: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'primary.main',
                                mb: 3,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                textAlign: 'center',
                                fontWeight: 700,
                            }}
                        >
                            Quick Actions
                        </Typography>
                        <SectionCards />
                    </Box>

                    <Divider />

                    {/* Stats */}
                    <Box sx={{ mt: 4, mb: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'primary.main',
                                mb: 3,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                textAlign: 'center',
                                fontWeight: 700,
                            }}
                        >
                            Today's Stats
                        </Typography>
                        {loading && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 5,
                                    animation: 'pulse 1.5s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            >
                                <CircularProgress size={48} />
                            </Box>
                        )}
                        {!loading && errMsg && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    animation: 'fadeIn 0.5s ease-in',
                                    fontSize: '1rem',
                                    py: 1.5,
                                }}
                            >
                                {errMsg}
                            </Alert>
                        )}
                        {!loading && !errMsg && <CardStats counts={counts} />}
                    </Box>

                    <Divider />

                    {/* Charts */}
                    <Box sx={{ mt: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'primary.main',
                                mb: 3,
                                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                textAlign: 'center',
                                fontWeight: 700,
                            }}
                        >
                            Charts (Last 30 Days)
                        </Typography>
                        {loading && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 5,
                                    animation: 'pulse 1.5s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            >
                                <CircularProgress size={48} />
                            </Box>
                        )}
                        {!loading && !errMsg && hasData && <ChartsSection graphs={graphs} />}
                    </Box>
                </Card>
            </Box>
        </ThemeProvider>
    );
}