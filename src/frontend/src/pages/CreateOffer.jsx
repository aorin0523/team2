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
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* ヘッダーセクション */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Business sx={{ fontSize: '3rem', mr: 2 }} />
            <Typography variant="h3" fontWeight="bold">
              新規オファー作成
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            新しい求人オファーを作成して優秀な人材を募集しましょう
          </Typography>
        </Box>

        {/* メインコンテンツ */}
        <Paper 
          elevation={10} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          {/* フォームヘッダー */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #495057 0%, #6c757d 100%)',
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              📝 オファー詳細情報
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              必須項目は * マークで表示されています
            </Typography>
          </Box>

          {/* フォームコンテンツ */}
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* タイトルセクション */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    border: '1px solid #90caf9'
                  }}
                >
                  <TextField
                    fullWidth
                    label="オファータイトル"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={!!validationErrors.title}
                    helperText={validationErrors.title || 'わかりやすく魅力的なタイトルを入力してください'}
                    placeholder="例: 【リモート可】フルスタックエンジニア募集 - 最新技術で事業成長を支える"
                    required
                    InputProps={{
                      sx: { 
                        borderRadius: 2,
                        background: 'white',
                        fontSize: '1.1rem'
                      }
                    }}
                    InputLabelProps={{
                      sx: { fontSize: '1.1rem', fontWeight: 'bold' }
                    }}
                  />
                </Box>
              </Grid>

              {/* 説明セクション */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    border: '1px solid #ce93d8'
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    label="オファー内容・説明"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    error={!!validationErrors.content}
                    helperText={validationErrors.content || '具体的な業務内容、必要なスキル、働く環境、魅力について詳しく記載してください'}
                    placeholder={`例:
【業務内容】
・Webアプリケーションのフロントエンド・バックエンド開発
・新機能の設計・実装・テスト
・既存システムの改善・最適化

【必要なスキル】
・JavaScript, TypeScript の実務経験（2年以上）
・React, Node.js の開発経験
・MySQL, PostgreSQL などのデータベース知識

【働く環境】
・リモートワーク可（週1-2回出社）
・最新技術導入に積極的
・チーム開発でのコードレビュー文化`}
                    required
                    InputProps={{
                      sx: { 
                        borderRadius: 2,
                        background: 'white'
                      }
                    }}
                    InputLabelProps={{
                      sx: { fontSize: '1.1rem', fontWeight: 'bold' }
                    }}
                  />
                </Box>
              </Grid>

              {/* 条件設定セクション */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 20%, #fff3e0 100%)',
                    border: '1px solid #ffb74d'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#e65100' }}>
                    募集条件設定
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* ランク */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!validationErrors.rank}>
                        <InputLabel sx={{ fontWeight: 'bold' }}>応募可能最低ランク *</InputLabel>
                        <Select
                          value={formData.rank}
                          onChange={(e) => handleInputChange('rank', e.target.value)}
                          label="応募可能最低ランク *"
                          sx={{ 
                            borderRadius: 2,
                            background: 'white'
                          }}
                        >
                          {rankOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Chip 
                                  label={option.label}
                                  size="small"
                                  color="primary"
                                  sx={{ 
                                    minWidth: 40,
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                  }}
                                />
                                <Typography variant="body1">{option.description}</Typography>
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
                          sx: { 
                            borderRadius: 2,
                            background: 'white'
                          }
                        }}
                        InputLabelProps={{
                          sx: { fontWeight: 'bold' }
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
                        placeholder="例: 年収500万円〜700万円、賞与年2回"
                        helperText="年収、時給、賞与、その他待遇について記載"
                        InputProps={{
                          sx: { 
                            borderRadius: 2,
                            background: 'white'
                          }
                        }}
                        InputLabelProps={{
                          sx: { fontWeight: 'bold' }
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
                        InputLabelProps={{ 
                          shrink: true,
                          sx: { fontWeight: 'bold' }
                        }}
                        inputProps={{ min: getTodayString() }}
                        InputProps={{
                          sx: { 
                            borderRadius: 2,
                            background: 'white'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            {/* アクションボタンセクション */}
            <Box 
              sx={{ 
                mt: 5,
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                border: '1px solid #e0e0e0'
              }}
            >
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                  sx={{
                    borderRadius: 3,
                    px: 5,
                    py: 1.5,
                    borderColor: '#757575',
                    color: '#757575',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: 160,
                    '&:hover': {
                      borderColor: '#424242',
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
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
                    borderRadius: 3,
                    px: 5,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    minWidth: 200,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                    },
                    '&:disabled': {
                      background: '#cccccc',
                      transform: 'none',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? '作成中...' : 'オファーを作成'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* 通知 */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success" 
            onClose={() => setSuccess('')}
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default CreateOffer;
