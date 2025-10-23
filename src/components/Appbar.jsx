import * as React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../assets/logo.png';
import { clearToken, isAuthenticated } from './utils/auth';

const theme = createTheme({
    palette: {
        primary: { main: '#0f3d3e' }, // Dark teal
        secondary: { main: '#d9af50' }, // Gold
        background: { default: '#f8fafc' }, // Light gray background
        success: { main: '#4CAF50' }, // Green (for consistency)
        warning: { main: '#FFC107' }, // Yellow (for consistency)
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    padding: '6px 12px',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(90deg, #0f3d3e 0%, #1e4b4c 100%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: { fontWeight: 700, fontFamily: '"Cinzel Decorative", serif' },
        button: { fontSize: { xs: '0.9rem', sm: '0.95rem' } },
    },
});

const drawerWidth = 240;

export default function Appbar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isAuth, setIsAuth] = React.useState(isAuthenticated());
    const navigate = useNavigate();
    const location = useLocation();

    // Update authentication state when storage changes
    React.useEffect(() => {
        const handleStorageChange = () => {
            setIsAuth(isAuthenticated());
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(() => {
            setIsAuth(isAuthenticated());
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Conditionally include Home and Back buttons
    const showNavButtons = !['/', '/login'].includes(location.pathname);

    const navItems = isAuth
        ? [
            ...(showNavButtons
                ? [
                    { title: 'Back', path: null, action: () => navigate(-1), icon: <ArrowBackIcon sx={{ mr: 0.5 }} /> },
                    { title: 'Home', path: '/', icon: <HomeIcon sx={{ mr: 0.5 }} /> },
                ]
                : []),
            { title: 'Logout', path: '/login', action: () => clearToken() },
        ]
        : [
            ...(showNavButtons
                ? [
                    { title: 'Home', path: '/', icon: <HomeIcon sx={{ mr: 0.5 }} /> },
                    { title: 'Back', path: null, action: () => navigate(-1), icon: <ArrowBackIcon sx={{ mr: 0.5 }} /> },
                ]
                : []),
            { title: 'Login', path: '/login' },
        ];

    const drawerItems = isAuth
        ? [
            { title: 'HOME', path: '/' },
            { title: 'New Registration', path: '/registration' },
            { title: 'Filter', path: '/filter' },
            { title: 'Update Customer', path: '/updatecustomer' },
            { title: 'Logout', path: '/login', action: () => clearToken() },
        ]
        : [
            ...(showNavButtons
                ? [
                    { title: 'HOME', path: '/', icon: <HomeIcon sx={{ mr: 1 }} /> },
                    { title: 'BACK', path: null, action: () => navigate(-1), icon: <ArrowBackIcon sx={{ mr: 1 }} /> },
                ]
                : []),
            { title: 'Login', path: '/login' },
        ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleNavClick = (item) => {
        if (item.action) {
            item.action();
            setIsAuth(isAuthenticated());
        }
        if (item.path) {
            navigate(item.path);
        }
        setMobileOpen(false);
    };

    const drawer = (
        <Box
            sx={{
                textAlign: 'center',
                bgcolor: '#0f3d3e',
                height: '100%',
                pt: 3,
                animation: 'slideIn 0.3s ease-out',
                '@keyframes slideIn': {
                    from: { transform: 'translateX(-100%)' },
                    to: { transform: 'translateX(0)' },
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img
                    src={logo}
                    alt="Archloom Logo"
                    style={{
                        height: 40,
                        width: 'auto',
                    }}
                />
            </Box>
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    color: '#fff',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
            >
                Archloom
            </Typography>
            <List>
                {drawerItems.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavClick(item)}
                            sx={{
                                textAlign: 'center',
                                py: 1.5,
                                '&.active': {
                                    backgroundColor: '#1e4b4c',
                                    '& .MuiListItemText-primary': { color: '#d9af50', fontWeight: 700 },
                                },
                                '&:hover': {
                                    backgroundColor: '#1e4b4c',
                                    '& .MuiListItemText-primary': { color: '#d9af50' },
                                    '& .MuiSvgIcon-root': { color: '#d9af50' },
                                },
                            }}
                        >
                            {item.icon}
                            <ListItemText
                                primary={item.title}
                                primaryTypographyProps={{
                                    sx: {
                                        color: '#fff',
                                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                        fontWeight: 500,
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar sx={{ mx: 'auto', maxWidth: '1200px', width: '100%' }}>
                    {/* Hamburger Menu */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ color: '#fff', mr: 2, '&:hover': { color: '#d9af50' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Logo and Title */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexGrow: 1,
                        }}
                    >
                        <img
                            src={logo}
                            alt="Archloom Logo"
                            style={{
                                height: 40,
                                width: 'auto',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#fff',
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                            }}
                        >
                            Archloom
                        </Typography>
                    </Box>
                    {/* Desktop Menu */}
                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.title}
                                component={item.path ? NavLink : 'button'}
                                to={item.path}
                                onClick={() => {
                                    if (item.action) {
                                        item.action();
                                        setIsAuth(isAuthenticated());
                                    }
                                }}
                                sx={{
                                    color: '#fff',
                                    position: 'relative',
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                    '&.active': {
                                        color: '#d9af50',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 4,
                                            left: 0,
                                            width: '100%',
                                            height: '2px',
                                            backgroundColor: '#d9af50',
                                            transform: 'scaleX(1)',
                                            transformOrigin: 'bottom left',
                                        },
                                    },
                                    '&:hover': {
                                        color: '#d9af50',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 4,
                                            left: 0,
                                            width: '100%',
                                            height: '2px',
                                            backgroundColor: '#d9af50',
                                            transform: 'scaleX(1)',
                                            transformOrigin: 'bottom left',
                                            transition: 'transform 0.3s ease-out',
                                        },
                                        '& .MuiSvgIcon-root': { color: '#d9af50' },
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 8,
                                        left: 0,
                                        width: '100%',
                                        height: '2px',
                                        backgroundColor: '#d9af50',
                                        transform: 'scaleX(0)',
                                        transformOrigin: 'bottom right',
                                        transition: 'transform 0.3s ease-out',
                                    },
                                }}
                            >
                                {item.icon}
                                {item.title}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: '#0f3d3e',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Box component="main" sx={{ p: 0 }}>
                <Toolbar />
            </Box>
        </ThemeProvider>
    );
}