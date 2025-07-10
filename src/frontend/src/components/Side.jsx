import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    Button
} from '@mui/material';
import '../css/side.css';

const Side = () => {
    const sidebarItems = [
        { text: "Home", icon: "🏠" },
        { text: "募集フォーム作成", icon: "📝" },
        { text: "オファーページ", icon: "👥" },
        { text: "設定", icon: "⚙️" }
    ];

    const getRankColor = (rank) => {
        switch (rank) {
            case 'A': return 'error';
            case 'B': return 'warning';
            case 'C': return 'info';
            default: return 'default';
        }
    };

    return (
        <Drawer
            variant="permanent"
            className="sidebar-drawer"
        >
            {/* ロゴエリア */}
            <div className="sidebar-logo">
                <div className="logo-container">

                    <Typography variant="h5" className="logo-text">
                        paiza
                    </Typography>
                </div>
            </div>

            {/* ナビゲーションメニュー */}
            <List className="nav-list">
                {sidebarItems.map((item, index) => (
                    <ListItem
                        button
                        key={item.text}
                        className={item.text === 'オファーページ' ? 'nav-item active' : 'nav-item'}
                    >
                        <ListItemIcon className="nav-item-icon">
                            <Typography className="nav-item-emoji">
                                {item.icon}
                            </Typography>
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                className: 'nav-item-text'
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            {/* ユーザー情報 */}
            <div className="sidebar-user">
                <Typography variant="body2" className="sidebar-user-name">
                    User Name
                </Typography>
                <Button
                    variant="text"
                    size="small"
                    className="sidebar-logout-btn"
                >
                    ⭐ Logout
                </Button>
            </div>
        </Drawer>
    );
};

export default Side;