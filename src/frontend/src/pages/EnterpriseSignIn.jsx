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
      const userInfoResponse = await fetch('http://localhost:8000/api/v1/auth/me', {
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Chip
              icon={<Business />}
              label="企業アカウント専用"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.9rem', px: 2 }}
            />
          </Box>
          
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            企業ログイン
          </Typography>
          
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            企業アカウントでのログインはこちら
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="企業メールアドレス"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              placeholder="company@example.com"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              {loading ? 'ログイン中...' : '企業アカウントでログイン'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                企業アカウントをお持ちでない方は{' '}
                <Link 
                  to="/enterprise/signup" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#1976d2',
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
