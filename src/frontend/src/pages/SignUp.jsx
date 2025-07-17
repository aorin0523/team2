import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      await register(userData);
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message || '登録に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '60px',
        paddingBottom: '60px'
      }}
    >
      {/* paizaロゴ */}
      <Box sx={{ mb: 6 }}>
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

      {/* メインフォーム */}
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
          新規ユーザー登録
        </Typography>

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: '20px' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}
            >
              氏名
            </Typography>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="paiza太郎"
              sx={{
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
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
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
              error={!!errors.email}
              helperText={errors.email}
              placeholder="例）user@example.com"
              sx={{
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
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
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
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="例）英数字記号含む8文字以上"
              sx={{
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
          </Box>

          <Box sx={{ marginBottom: '30px' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}
            >
              パスワード確認
            </Typography>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
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
          </Box>

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
              '&:hover': {
                backgroundColor: '#0088c7'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666'
              }
            }}
          >
            {loading ? '登録中...' : 'アカウント作成'}
          </Button>

          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              すでにアカウントをお持ちの方は{' '}
              <Link
                to="/signin"
                style={{
                  textDecoration: 'none',
                  color: '#00a0dc',
                  fontWeight: 'bold'
                }}
              >
                こちらからログイン
              </Link>
            </Typography>

            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
              企業ユーザーの方は{' '}
              <Link
                to="/enterprise/signup"
                style={{
                  textDecoration: 'none',
                  color: '#666'
                }}
              >
                企業ユーザー登録
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
