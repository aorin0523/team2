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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

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
        const response = await fetch('http://localhost:8000/api/v1/enterprises/');
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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            企業ユーザー登録
          </Typography>
          
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="氏名"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.enterprise_id}>
                  <InputLabel id="enterprise-select-label">企業 *</InputLabel>
                  <Select
                    labelId="enterprise-select-label"
                    id="enterprise_id"
                    name="enterprise_id"
                    value={formData.enterprise_id}
                    label="企業 *"
                    onChange={handleChange}
                  >
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
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="rank-select-label">ランク</InputLabel>
                  <Select
                    labelId="rank-select-label"
                    id="rank"
                    name="rank"
                    value={formData.rank}
                    label="ランク"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>D</MenuItem>
                    <MenuItem value={2}>C</MenuItem>
                    <MenuItem value={3}>B</MenuItem>
                    <MenuItem value={4}>A</MenuItem>
                    <MenuItem value={5}>S</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="パスワード確認"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? '登録中...' : '企業ユーザー登録'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin">
                  すでにアカウントをお持ちですか？ログイン
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
              <Grid item>
                <Link to="/signup">
                  一般ユーザーとして登録
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EnterpriseSignUp;
