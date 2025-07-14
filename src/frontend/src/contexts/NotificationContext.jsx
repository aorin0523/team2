import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../config/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 未読通知数を取得
  const fetchUnreadCount = async () => {
    if (!user || !token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.USER_NOTIFICATIONS_UNREAD_COUNT(user.id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setUnreadCount(data.count);
        }
      }
    } catch (error) {
      console.error('未読通知数の取得に失敗:', error);
      // APIが失敗した場合はフォールバック（サンプルデータ使用）
      setUnreadCount(2); // サンプル: 2件の未読通知
    }
  };

  // 通知一覧を取得
  const fetchNotifications = async () => {
    if (!user || !token) {
      // ログインしていない場合はサンプルデータ
      setNotifications([
        {
          id: 1,
          type: 'assignment',
          title: 'バックエンドエンジニア',
          enterprise_name: 'Tech Corp',
          message: 'あなたがこのプロジェクトにアサインされました',
          created_at: '2025-07-15T10:30:00',
          is_read: false
        },
        {
          id: 2,
          type: 'assignment',
          title: 'フロントエンドエンジニア',
          enterprise_name: 'Finance Inc',
          message: 'あなたがこのプロジェクトにアサインされました',
          created_at: '2025-07-14T15:45:00',
          is_read: true
        }
      ]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USER_NOTIFICATIONS(user.id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setNotifications(data.notifications);
        } else {
          throw new Error('通知データの取得に失敗');
        }
      } else {
        throw new Error('API呼び出しに失敗');
      }
    } catch (error) {
      console.error('通知一覧の取得に失敗:', error);
      // APIが失敗した場合はサンプルデータを使用
      setNotifications([
        {
          id: 1,
          type: 'assignment',
          title: 'バックエンドエンジニア',
          enterprise_name: 'Tech Corp',
          message: 'あなたがこのプロジェクトにアサインされました',
          created_at: '2025-07-15T10:30:00',
          is_read: false
        },
        {
          id: 2,
          type: 'assignment',
          title: 'フロントエンドエンジニア',
          enterprise_name: 'Finance Inc',
          message: 'あなたがこのプロジェクトにアサインされました',
          created_at: '2025-07-14T15:45:00',
          is_read: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 通知を既読にする
  const markAsRead = async (notificationId) => {
    if (!user || !token) {
      // サンプルデータの場合はローカル状態のみ更新
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.MARK_NOTIFICATION_READ(notificationId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // ローカル状態を更新
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('既読更新に失敗:', error);
    }
  };

  // 全通知を既読にする
  const markAllAsRead = async () => {
    if (!user || !token) {
      // サンプルデータの場合はローカル状態のみ更新
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ(user.id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // ローカル状態を更新
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('全既読更新に失敗:', error);
    }
  };

  // ユーザーが変わった時に通知データを更新
  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
  }, [user, token]);

  // 定期的に未読数を更新（30秒間隔）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, token]);

  const value = {
    unreadCount,
    notifications,
    loading,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications: () => {
      fetchUnreadCount();
      fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
