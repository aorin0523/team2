import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Business } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const EnterpriseSignUp = () => {
  const navigate = useNavigate();
  const { registerEnterprise } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    enterprise_id: '',
    rank: 1
  });
  const [enterprises, setEnterprises] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 企業一覧を取得
  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.ENTERPRISES_PROFILE.replace('/profile', '')}/`);
        if (response.ok) {
          const data = await response.json();
          setEnterprises(data);
        }
      } catch (error) {
        console.error('Failed to fetch enterprises:', error);
      }
    };

    fetchEnterprises();
  }, []);

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

    if (!formData.enterprise_id) {
      newErrors.enterprise_id = '企業を選択してください';
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
        password: formData.password,
        enterprise_id: formData.enterprise_id,
        rank: formData.rank
      };

      await registerEnterprise(userData);
      navigate('/enterprise');
    } catch (error) {
      setErrors({ submit: error.message || '企業ユーザー登録に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

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
              label="企業ユーザー登録"
              color="primary"
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
          
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            企業ユーザー登録
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            企業アカウントを作成して、優秀な人材との出会いを始めましょう
          </Typography>
          
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errors.submit}
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
                required
                fullWidth
                id="name"
                label="👤 氏名"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
              
              <TextField
                required
                fullWidth
                id="email"
                label="📧 メールアドレス"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
              
              <FormControl fullWidth error={!!errors.enterprise_id}>
                <InputLabel id="enterprise-select-label" sx={{ color: '#1976d2' }}>
                  🏢 企業を選択 *
                </InputLabel>
                <Select
                  labelId="enterprise-select-label"
                  id="enterprise_id"
                  name="enterprise_id"
                  value={formData.enterprise_id}
                  label="🏢 企業を選択 *"
                  onChange={handleChange}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em style={{ color: '#666' }}>企業を選択してください</em>
                  </MenuItem>
                  {enterprises.map((enterprise) => (
                    <MenuItem key={enterprise.id} value={enterprise.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#1976d2',
                          }}
                        />
                        {enterprise.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.enterprise_id && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.enterprise_id}
                  </Typography>
                )}
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="rank-select-label" sx={{ color: '#1976d2' }}>
                  ⭐ ランクを選択
                </InputLabel>
                <Select
                  labelId="rank-select-label"
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  label="⭐ ランクを選択"
                  onChange={handleChange}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  <MenuItem value={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ color: '#9e9e9e' }}>D</span>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>(入門レベル)</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ color: '#2196f3' }}>C</span>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>(初級レベル)</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ color: '#ff9800' }}>B</span>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>(中級レベル)</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ color: '#f44336' }}>A</span>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>(上級レベル)</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ color: '#9c27b0', fontWeight: 'bold' }}>S</span>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>(最高レベル)</span>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                required
                fullWidth
                name="password"
                label="🔒 パスワード"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
              
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="🔒 パスワード確認"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
              {loading ? '登録中...' : '🚀 企業アカウントを作成'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                すでにアカウントをお持ちの方は{' '}
                <Link 
                  to="/enterprise/signin" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#1976d2',
                    fontWeight: 'bold'
                  }}
                >
                  企業ログイン
                </Link>
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                一般ユーザーの方は{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#666'
                  }}
                >
                  一般ユーザー登録
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EnterpriseSignUp;
