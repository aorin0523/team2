import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import { Visibility, VisibilityOff, Business } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const EnterpriseSignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    
    try {
      await signIn(formData.email, formData.password);
      
      // ログイン後にユーザー情報を取得して企業アカウントかチェック
      const userInfoResponse = await fetch(API_ENDPOINTS.USERS_PROFILE.replace('/users/', '/auth/me'), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        
        if (userInfo.enterprise_id) {
          // 企業ユーザーの場合は企業ダッシュボードにリダイレクト
          navigate('/enterprise');
        } else {
          // 一般ユーザーの場合はエラーメッセージを表示
          setError('このページは企業アカウント専用です。一般ユーザーの方は通常のログインページをご利用ください。');
          return;
        }
      } else {
        setError('ユーザー情報の取得に失敗しました');
      }
    } catch (error) {
      setError(error.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 5, 
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Chip
              icon={<Business />}
              label="企業アカウント専用"
              color="warning"
              variant="filled"
              sx={{ 
                fontSize: '1rem', 
                px: 3, 
                py: 2,
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
          </Box>
          
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ color: '#424242', fontWeight: 'bold' }}>
            企業ログイン
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            企業アカウントでログインして人材管理を始めましょう
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                backgroundColor: 'white',
                p: 4,
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="🏢 企業メールアドレス"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
                placeholder="company@example.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="🔒 パスワード"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 4, 
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #424242 30%, #757575 90%)',
                boxShadow: '0 3px 15px rgba(66, 66, 66, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #212121 30%, #424242 90%)',
                  boxShadow: '0 5px 20px rgba(66, 66, 66, 0.4)',
                },
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e',
                }
              }}
            >
              {loading ? 'ログイン中...' : '🏢 企業アカウントでログイン'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                企業アカウントをお持ちでない方は{' '}
                <Link 
                  to="/enterprise/signup" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#e65100',
                    fontWeight: 'bold'
                  }}
                >
                  企業登録はこちら
                </Link>
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                一般ユーザーの方は{' '}
                <Link 
                  to="/signin" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#666'
                  }}
                >
                  通常のログインページ
                </Link>
                {' '}をご利用ください
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EnterpriseSignIn;
