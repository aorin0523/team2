import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireEnterprise = false, requireUser = false }) => {
  const { isAuthenticated, isEnterpriseUser, isRegularUser, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // 未認証の場合、適切なログインページにリダイレクト
      if (!isAuthenticated) {
        if (requireEnterprise) {
          navigate('/enterprise/signin');
        } else if (requireUser) {
          navigate('/signin');
        } else {
          navigate('/');
        }
        return;
      }

      // 企業ユーザーが必要なのに一般ユーザーがアクセスした場合
      if (requireEnterprise && !isEnterpriseUser) {
        navigate('/enterprise/signin');
        return;
      }

      // 一般ユーザーが必要なのに企業ユーザーがアクセスした場合
      if (requireUser && !isRegularUser) {
        navigate('/signin');
        return;
      }
    }
  }, [
    loading,
    isAuthenticated,
    isEnterpriseUser,
    isRegularUser,
    requireEnterprise,
    requireUser,
    navigate
  ]);

  // ローディング中
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          認証情報を確認中...
        </Typography>
      </Box>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト処理中）
  if (!isAuthenticated) {
    return null;
  }

  // 権限チェック
  if (requireEnterprise && !isEnterpriseUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          このページにアクセスするには企業アカウントが必要です
        </Alert>
        <Typography variant="body1" color="textSecondary">
          企業アカウントでログインしてください
        </Typography>
      </Box>
    );
  }

  if (requireUser && !isRegularUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          このページにアクセスするには一般ユーザーアカウントが必要です
        </Alert>
        <Typography variant="body1" color="textSecondary">
          一般ユーザーアカウントでログインしてください
        </Typography>
      </Box>
    );
  }

  // 認証済みで適切なユーザータイプの場合、子コンポーネントを表示
  return children;
};

export default ProtectedRoute;
