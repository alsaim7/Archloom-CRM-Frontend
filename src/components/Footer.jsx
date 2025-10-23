import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Divider,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import logo from '../assets/logo.png'; // Same logo as Appbar.jsx

const theme = createTheme({
    palette: {
        primary: { main: '#0f3d3e' }, // Dark teal
        secondary: { main: '#d9af50' }, // Gold
        background: { default: '#f8fafc' }, // Light gray background
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: { fontWeight: 700 },
        body2: { fontSize: '0.875rem' },
    },
});

const footerLinks = [
    { title: 'Home', path: '/' },
    { title: 'New Registration', path: '/registration' },
    { title: 'Filter', path: '/filter' },
    { title: 'Update Customer', path: '/updatecustomer' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <ThemeProvider theme={theme}>
            <Box
                component="footer"
                sx={{
                    bgcolor: 'primary.main',
                    color: '#fff',
                    py: { xs: 3, sm: 4 },
                    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
                    animation: 'fadeIn 0.5s ease-in',
                    '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            gap: { xs: 3, sm: 2 },
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        {/* Branding Section */}
                        <Box sx={{ maxWidth: { xs: '100%', sm: '30%' } }}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2 }}>
                                <img
                                    src={logo}
                                    alt="Archloom Logo"
                                    style={{ height: 40, width: 'auto' }}
                                />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Cinzel Decorative", serif',
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                    mb: 1,
                                }}
                            >
                                Archloom
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                Empowering customer management with seamless solutions.
                            </Typography>
                        </Box>

                        {/* Quick Links Section */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.1rem' }}>
                                Quick Links
                            </Typography>
                            {footerLinks.map((link) => (
                                <Typography
                                    key={link.title}
                                    component={Link}
                                    to={link.path}
                                    sx={{
                                        display: 'block',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                        mb: 1,
                                        fontSize: '0.875rem',
                                        position: 'relative',
                                        '&:hover': {
                                            color: 'secondary.main',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -2,
                                                left: 0,
                                                width: '100%',
                                                height: '2px',
                                                backgroundColor: '#d9af50',
                                                transform: 'scaleX(1)',
                                                transformOrigin: 'bottom left',
                                                transition: 'transform 0.3s ease-out',
                                            },
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -2,
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
                                    {link.title}
                                </Typography>
                            ))}
                        </Box>

                        {/* Contact Section */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.1rem' }}>
                                Contact Dev
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                Email: alsaimshakeel45@gmail.com
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                Phone: +91 630-788-3565
                            </Typography>
                        </Box>

                        {/* Developer Credit Section */}
                        <Box>
                            <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.1rem' }}>
                                Developer
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                Developed by Al Saim Shakeel
                            </Typography>
                            <Typography
                                component="a"
                                href="https://alsaim.pages.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: 'secondary.main',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                alsaim.pages.dev
                            </Typography>
                        </Box>
                    </Box>

                    {/* Divider */}
                    <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        &copy; {currentYear} Archloom. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
}