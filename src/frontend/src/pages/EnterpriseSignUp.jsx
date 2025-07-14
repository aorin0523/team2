import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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

      {/* メインフォーム */}
      <Box
        sx={{
          width: '400px',
          backgroundColor: 'white',
          border: '2px solid #ff9800',
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
          企業ユーザー登録
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
              placeholder="氏名"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: '#ddd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff9800',
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
              placeholder="メールアドレス"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: '#ddd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff9800',
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
              企業を選択
            </Typography>
            <FormControl fullWidth error={!!errors.enterprise_id}>
              <Select
                id="enterprise_id"
                name="enterprise_id"
                value={formData.enterprise_id}
                onChange={handleChange}
                displayEmpty
                sx={{
                  fontSize: '14px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800',
                  },
                  '& .MuiSelect-select': {
                    padding: '12px 14px'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: '#999' }}>企業を選択してください</em>
                </MenuItem>
                {enterprises.map((enterprise) => (
                  <MenuItem key={enterprise.id} value={enterprise.id}>
                    {enterprise.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.enterprise_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.enterprise_id}
                </Typography>
              )}
            </FormControl>
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
              ランクを選択
            </Typography>
            <FormControl fullWidth>
              <Select
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                sx={{
                  fontSize: '14px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ddd',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff9800',
                  },
                  '& .MuiSelect-select': {
                    padding: '12px 14px'
                  }
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
              placeholder="パスワード"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: '#ddd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff9800',
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
              placeholder="パスワード確認"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: '#ddd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#ff9800',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff9800',
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
              backgroundColor: '#ff9800',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '12px',
              borderRadius: '4px',
              textTransform: 'none',
              marginBottom: '20px',
              '&:hover': {
                backgroundColor: '#f57c00'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666'
              }
            }}
          >
            {loading ? '登録中...' : 'アカウント作成'}
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
              すでにアカウントをお持ちの方は{' '}
              <Link
                to="/enterprise/signin"
                style={{
                  textDecoration: 'none',
                  color: '#ff9800',
                  fontWeight: 'bold'
                }}
              >
                企業ログイン
              </Link>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '14px'
              }}
            >
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
      </Box>
    </Box>
  );
};

export default EnterpriseSignUp;
