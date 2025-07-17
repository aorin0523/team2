import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Button,
  IconButton
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Update as UpdateIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const UserNotifications = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}日前`;
    } else if (hours > 0) {
      return `${hours}時間前`;
    } else {
      return '1時間以内';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRefresh = () => {
    refreshNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <AssignmentIcon />;
      case 'application_update':
        return <UpdateIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ 
            fontWeight: 'bold',
            color: '#333'
          }}>
            通知一覧
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={handleRefresh}
              size="small"
              sx={{ color: '#666' }}
            >
              <RefreshIcon />
            </IconButton>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{
                  fontSize: '0.8rem',
                  borderColor: '#ccc',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#999',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                すべて既読にする
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              新しい通知はありません
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.is_read ? 'transparent' : '#f8f9fa',
                    borderRadius: 1,
                    mb: 1,
                    border: notification.is_read ? '1px solid #e0e0e0' : '2px solid #2196F3',
                    borderLeft: notification.is_read ? '1px solid #e0e0e0' : '4px solid #2196F3',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: notification.is_read ? '#f9f9f9' : '#e8f4fd',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      backgroundColor: notification.is_read ? '#9e9e9e' : '#2196F3',
                      color: 'white',
                      width: 40,
                      height: 40
                    }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          sx={{ 
                            fontWeight: notification.is_read ? 'normal' : 'bold',
                            color: notification.is_read ? '#666' : '#333'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: '#666' }}
                        >
                          - {notification.enterprise_name}
                        </Typography>
                        {!notification.is_read && (
                          <Chip
                            label="新着"
                            size="small"
                            sx={{
                              backgroundColor: '#2196F3',
                              color: 'white',
                              fontSize: '0.75rem',
                              height: '20px'
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ 
                            color: notification.is_read ? '#777' : '#555', 
                            display: 'block', 
                            mb: 1,
                            fontWeight: notification.is_read ? 'normal' : '500'
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: '#888' }}
                          >
                            {formatDate(notification.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}

        {notifications.length > 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              {unreadCount}件の未読通知があります
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserNotifications;
