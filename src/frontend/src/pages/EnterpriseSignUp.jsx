import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const EnterpriseSignUp = () => {
  const navigate = useNavigate();
  const { registerEnterprise } = useAuth();  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    enterprise_name: '',
    enterprise_description: ''
  });  const [errors, setErrors] = useState({});
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

    if (!formData.enterprise_name.trim()) {
      newErrors.enterprise_name = '企業名は必須です';
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
      // 1. まず企業を作成
      const enterpriseResponse = await fetch(API_ENDPOINTS.ENTERPRISES_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.enterprise_name,
          description: formData.enterprise_description
        }),
      });

      if (!enterpriseResponse.ok) {
        const errorData = await enterpriseResponse.json();
        throw new Error(errorData.detail || '企業の作成に失敗しました');
      }

      const enterpriseData = await enterpriseResponse.json();
      const enterpriseId = enterpriseData.enterprise_id;

      // 2. 企業ユーザーを作成
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        enterprise_id: enterpriseId
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
          </Box>          <Box sx={{ marginBottom: '20px' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}
            >
              企業名
            </Typography>
            <TextField
              required
              fullWidth
              id="enterprise_name"
              name="enterprise_name"
              value={formData.enterprise_name}
              onChange={handleChange}
              error={!!errors.enterprise_name}
              helperText={errors.enterprise_name}
              placeholder="企業名"
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
              企業説明（任意）
            </Typography>
            <TextField
              fullWidth
              id="enterprise_description"
              name="enterprise_description"
              multiline
              rows={3}
              value={formData.enterprise_description}
              onChange={handleChange}
              placeholder="企業の説明や事業内容を入力してください"
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
