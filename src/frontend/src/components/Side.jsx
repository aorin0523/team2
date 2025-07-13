import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  AccountCircle,
  ExitToApp,
  Settings,
  Person,
  MoreVert,
} from "@mui/icons-material";
import "../css/side.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const Side = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const sidebarItems = [
    { text: "ホーム", icon: "🏠", path: "/enterprise", id: "home" },
    { text: "募集フォーム作成", icon: "📝", path: "/enterprise/offer/create", id: "create" },
    { text: "オファー管理", icon: "👥", path: "/enterprise/offer", id: "offers" },
    { text: "応募者管理", icon: "📊", path: "/enterprise/applications", id: "applications" },
    { text: "設定", icon: "⚙️", path: "/enterprise/settings", id: "settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case "S":
        return "#9c27b0";
      case "A":
        return "#f44336";
      case "B":
        return "#ff9800";
      case "C":
        return "#2196f3";
      case "D":
        return "#9e9e9e";
      default:
        return "#9e9e9e";
    }
  };
  return (
    <ProtectedRoute requireEnterprise={true}>
      <Stack direction={"row"}>
        <Drawer 
          variant="permanent" 
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #424242 0%, #212121 100%)',
            color: 'white',
            borderRight: 'none',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          },
        }}
      >
        {/* ロゴエリア */}
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              mb: 1,
            }}
          >
            🥧 ぱいざ
          </Typography>
          <Chip 
            label="企業管理画面"
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>

        {/* ナビゲーションメニュー */}
        <List sx={{ flexGrow: 1, px: 2, py: 2, display: "flex", flexFlow: 'column' }}>
          {sidebarItems.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{ mb: 1 }}
            >
              <Button
                fullWidth
                onClick={() => handleNavigation(item.path)}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: isCurrentPath(item.path) ? 'bold' : 'normal',
                  backgroundColor: isCurrentPath(item.path) 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={
                  <Typography sx={{ fontSize: '1.5rem', mr: 1 }}>
                    {item.icon}
                  </Typography>
                }
              >
                {item.text}
              </Button>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* ユーザー情報 */}
        <Box sx={{ p: 2 }}>
          {isAuthenticated && user ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mr: 2,
                }}
              >
                <AccountCircle />
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.9rem',
                  }}
                >
                  {user.name || 'ユーザー'}
                </Typography>
                
                {user.rank && (
                  <Chip
                    label={`ランク ${user.rank}`}
                    size="small"
                    sx={{
                      backgroundColor: getRankColor(user.rank),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                )}
              </Box>

              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  color: 'white',
                  p: 1,
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                ログインしてください
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/enterprise/signin')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                ログイン
              </Button>
            </Box>
          )}
        </Box>

        {/* ユーザーメニュー */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfile}>
            <Person sx={{ mr: 1 }} />
            プロフィール
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/enterprise/settings'); }}>
            <Settings sx={{ mr: 1 }} />
            設定
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ mr: 1 }} />
            ログアウト
          </MenuItem>
        </Menu>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}      >
        <Outlet />
      </Box>
    </Stack>
    </ProtectedRoute>
  );
};

export default Side;
