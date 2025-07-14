import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Stack,
    Badge
} from '@mui/material';
import {
    Assignment,
    Notifications,
    Mail,
    Help,
    AccountCircle
} from '@mui/icons-material';
import '../css/header.css';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import ProtectedRoute from './ProtectedRoute';


const Header = () => {

    const { user, logout, isAuthenticated, Loading } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };return (
        <ProtectedRoute requireUser={true}>
        <AppBar
            position="static"
            className="header-appbar"
            sx={{
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                margin: 0,
            }}
        >
            <Toolbar className="header-toolbar">
                {/* ロゴ */}
                <Box
                    className="header-logo"
                >
                    <Typography variant="h4" className="logo-text">
                        paiza
                    </Typography>
                </Box>

                {/* 中央のナビゲーション */}
                <Box className="header-nav-box">
                    <Button
                        color="inherit"
                        className="header-nav-button"
                    >
                        仕事を探す
                    </Button>
                    <Button
                        color="inherit"
                        className="header-nav-button"
                    >
                        仕事の管理
                    </Button>
                </Box>

                {/* 右側のアイコンメニュー */}
                <Stack direction="row" spacing={1} className="header-icons-stack">
                    {isAuthenticated ? (
                        <Box>
                            <IconButton
                                color="inherit"
                                className="header-icon-button"
                            >
                                <Assignment />
                            </IconButton>                            <IconButton
                                color="inherit"
                                className="header-icon-button"
                                component={Link}
                                to="/user/notifications"
                            >
                                <Badge 
                                    badgeContent={unreadCount} 
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.75rem',
                                            height: '18px',
                                            minWidth: '18px',
                                            backgroundColor: '#ff4444',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    <Notifications />
                                </Badge>
                            </IconButton>
                            <IconButton
                                color="inherit"
                                className="header-icon-button"
                            >
                                <Mail />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                className="header-icon-button"
                            >
                                <Help />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                className="header-profile-button"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                                ようこそ、{user?.name}さん
                            </Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                ログアウト
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Button color="inherit" component={Link} to="/signin" sx={{ mr: 1 }}>
                                ログイン
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                登録
                            </Button>
                        </Box>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
        <Outlet />
        </ProtectedRoute>
    );
};

export default Header;