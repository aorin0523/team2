import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Grid,
  Chip
} from '@mui/material';
import {
  Business,
  Add,
  Save,
  Cancel
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function CreateOffer() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rank: 1,
    salary: '',
    capacity: 1,
    deadline: ''
  });

  // バリデーションエラー
  const [validationErrors, setValidationErrors] = useState({});

  // ランクの表示名マッピング
  const rankOptions = [
    { value: 1, label: 'D', description: '入門レベル' },
    { value: 2, label: 'C', description: '初級レベル' },
    { value: 3, label: 'B', description: '中級レベル' },
    { value: 4, label: 'A', description: '上級レベル' },
    { value: 5, label: 'S', description: '最高レベル' }
  ];

  // フォームデータの更新
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // バリデーションエラーをクリア
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // バリデーション
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'タイトルは必須です';
    } else if (formData.title.length > 255) {
      errors.title = 'タイトルは255文字以内で入力してください';
    }

    if (!formData.content.trim()) {
      errors.content = '説明は必須です';
    }

    if (!formData.rank || formData.rank < 1 || formData.rank > 5) {
      errors.rank = '有効なランクを選択してください';
    }

    if (formData.capacity && (formData.capacity < 1 || formData.capacity > 999)) {
      errors.capacity = '募集人数は1〜999人の範囲で入力してください';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        errors.deadline = '締切日は今日以降の日付を設定してください';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // オファー作成処理
  const handleCreateOffer = async () => {
    if (!validateForm()) {
      setError('入力内容を確認してください');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const offerData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        rank: formData.rank,
        salary: formData.salary.trim() || null,
        capacity: formData.capacity || null,
        deadline: formData.deadline || null
      };

      const response = await fetch(API_ENDPOINTS.OFFERS_MY_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'オファーの作成に失敗しました');
      }

      const result = await response.json();
      setSuccess('オファーが正常に作成されました');
      
      // 3秒後にオファー管理ページに遷移
      setTimeout(() => {
        navigate('/enterprise/offer');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    navigate('/enterprise/offer');
  };

  // 今日の日付を取得（最小値として使用）
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 3
      }}
    >
      <Container maxWidth="md">
        {/* ヘッダー */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #424242 0%, #757575 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Business sx={{ mr: 2, fontSize: '2rem' }} />
            <Typography variant="h4" fontWeight="bold">
              新規オファー作成
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            新しい求人オファーを作成して優秀な人材を募集しましょう
          </Typography>
        </Paper>

        {/* メインフォーム */}
        <Paper elevation={6} sx={{ borderRadius: 3, p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              📝 オファー詳細情報
            </Typography>
            <Typography variant="body2" color="text.secondary">
              必須項目は * マークで表示されています
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* タイトル */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="オファータイトル *"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={!!validationErrors.title}
                helperText={validationErrors.title}
                placeholder="例: フルスタックエンジニア募集"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* 説明 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="オファー内容・説明 *"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                error={!!validationErrors.content}
                helperText={validationErrors.content}
                placeholder="具体的な業務内容、必要なスキル、働く環境について詳しく記載してください"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* ランク */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!validationErrors.rank}>
                <InputLabel>応募可能最低ランク *</InputLabel>
                <Select
                  value={formData.rank}
                  onChange={(e) => handleInputChange('rank', e.target.value)}
                  label="応募可能最低ランク *"
                  sx={{ borderRadius: 2 }}
                >
                  {rankOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={option.label}
                          size="small"
                          color="primary"
                          sx={{ minWidth: 30 }}
                        />
                        <Typography>{option.description}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.rank && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                    {validationErrors.rank}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* 募集人数 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="募集人数"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || '')}
                error={!!validationErrors.capacity}
                helperText={validationErrors.capacity || '未入力の場合は人数制限なし'}
                inputProps={{ min: 1, max: 999 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* 給料 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="給料・待遇"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="例: 500万円〜700万円"
                helperText="年収や時給、その他待遇について記載"
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            {/* 締切日 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="応募締切日"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                error={!!validationErrors.deadline}
                helperText={validationErrors.deadline || '未設定の場合は締切なし'}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTodayString() }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
          </Grid>

          {/* アクションボタン */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleCancel}
              startIcon={<Cancel />}
              sx={{
                borderRadius: 2,
                px: 4,
                borderColor: '#757575',
                color: '#757575',
                '&:hover': {
                  borderColor: '#424242',
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              キャンセル
            </Button>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateOffer}
              disabled={loading}
              startIcon={loading ? null : <Save />}
              sx={{
                borderRadius: 2,
                px: 4,
                background: 'linear-gradient(45deg, #424242 30%, #757575 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #212121 30%, #424242 90%)',
                },
                '&:disabled': {
                  background: '#cccccc'
                }
              }}
            >
              {loading ? '作成中...' : 'オファーを作成'}
            </Button>
          </Box>
        </Paper>

        {/* 通知 */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default CreateOffer;
