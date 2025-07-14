import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
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
      navigate('/');
    } catch (error) {
      setError(error.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingTop: '20px',
        paddingBottom: '60px'
      }}
    >
      {/* paizaロゴ */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            color: '#00a6b8',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            fontSize: '48px',
          }}
        >
          paiza
        </Typography>
      </Box>

      <Box
        sx={{
          width: '400px',
          backgroundColor: 'white',
          border: '2px solid #00a0dc',
          borderRadius: '8px',
          padding: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '30px',
            color: '#333'
          }}
        >
          ログイン
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#333',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            メールアドレス
          </Typography>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
            placeholder="メールアドレス"
            sx={{
              marginBottom: '20px',
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#00a0dc',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00a0dc',
                }
              },
              '& .MuiInputBase-input': {
                padding: '12px 14px'
              }
            }}
          />

          <Typography
            sx={{
              fontSize: '14px',
              color: '#333',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            パスワード
          </Typography>
          <TextField
            required
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="パスワード"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              marginBottom: '30px',
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#00a0dc',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00a0dc',
                }
              },
              '& .MuiInputBase-input': {
                padding: '12px 14px'
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#00a0dc',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '12px',
              borderRadius: '4px',
              textTransform: 'none',
              marginBottom: '20px',
              '&:hover': {
                backgroundColor: '#0088c7'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666'
              }
            }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            >
              アカウントをお持ちでない方は{' '}
              <Link
                to="/signup"
                style={{
                  textDecoration: 'none',
                  color: '#00a0dc',
                  fontWeight: 'bold'
                }}
              >
                こちらから登録
              </Link>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '14px'
              }}
            >
              企業アカウントをお持ちの方は{' '}
              <Link
                to="/enterprise/signin"
                style={{
                  textDecoration: 'none',
                  color: '#666'
                }}
              >
                企業ログイン
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;