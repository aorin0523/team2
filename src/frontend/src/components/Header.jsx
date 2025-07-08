import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Stack
} from '@mui/material';
import {
    Assignment,
    Notifications,
    Mail,
    Help,
    AccountCircle
} from '@mui/icons-material';
import '../css/header.css';

const Header = () => {
    return (
        <AppBar
            position="static"
            className="header-appbar"
            sx={{
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <Toolbar className="header-toolbar">
                {/* ロゴ */}
                <Typography
                    variant="h4"
                    component="h1"
                    className="header-logo"
                >
                    <Typography variant="h4" className="logo-text">
                        paiza
                    </Typography>
                </Typography>

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
                    <IconButton
                        color="inherit"
                        className="header-icon-button"
                    >
                        <Assignment />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        className="header-icon-button"
                    >
                        <Notifications />
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
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Header;