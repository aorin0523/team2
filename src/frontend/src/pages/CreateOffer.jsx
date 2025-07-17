import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import {
  Business,
  Add,
  Save,
  Cancel,
  CloudUpload,
  Delete,
  Image as ImageIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function CreateOffer() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rank: 1,
    salary: '',
    capacity: 1,
    deadline: '',
    skills: []  // スキル配列を追加
  });

  // スキル関連のstate
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  // 画像アップロード関連のstate
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [tempImageUuid, setTempImageUuid] = useState(null);

  // バリデーションエラー
  const [validationErrors, setValidationErrors] = useState({});

  // スキル一覧を取得
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setSkillsLoading(true);
        const response = await fetch(API_ENDPOINTS.OFFERS_SKILLS);
        
        if (response.ok) {
          const data = await response.json();
          setAvailableSkills(data.skills || []);
        } else {
          console.error('Failed to fetch skills');
          setAvailableSkills([]);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        setAvailableSkills([]);
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, []);

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

    // 画像アップロードの必須チェック
    if (!tempImageUuid) {
      errors.image = 'オファー画像は必須です';
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

  // 画像ファイル選択処理
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      setError('画像ファイルのみアップロード可能です');
      return;
    }

    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください');
      return;
    }

    setImageFile(file);
    handleImageUpload(file);
  };

  // 画像アップロード処理 (tempバケットに保存)
  const handleImageUpload = async (file) => {
    try {
      setImageUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_ENDPOINTS.MINIO_UPLOAD_TEMP, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('画像のアップロードに失敗しました');
      }

      const result = await response.json();
      setTempImageUuid(result.file_uuid);
      
      // プレビュー用のURL作成
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(previewUrl);

      // 画像アップロード成功時にバリデーションエラーをクリア
      setValidationErrors(prev => ({
        ...prev,
        image: ''
      }));

    } catch (err) {
      setError(err.message);
      setImageFile(null);
    } finally {
      setImageUploading(false);
    }
  };

  // 画像削除処理
  const handleImageRemove = async () => {
    if (tempImageUuid) {
      try {
        await fetch(API_ENDPOINTS.MINIO_DELETE('temp', `${tempImageUuid}.${imageFile?.name.split('.').pop()}`), {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Temp画像の削除に失敗:', err);
      }
    }

    setUploadedImage(null);
    setImageFile(null);
    setTempImageUuid(null);
    
    // 画像を削除した際にバリデーションエラーを設定
    setValidationErrors(prev => ({
      ...prev,
      image: 'オファー画像は必須です'
    }));
  };

  // オファー作成処理
  const handleCreateOffer = async () => {
    if (!validateForm()) {
      // 具体的にどの項目が不足しているかを表示
      const missingFields = [];
      if (!formData.title.trim()) missingFields.push('タイトル');
      if (!formData.content.trim()) missingFields.push('説明');
      if (!tempImageUuid) missingFields.push('画像');
      
      const errorMessage = missingFields.length > 0 
        ? `以下の必須項目を入力してください: ${missingFields.join('、')}`
        : '入力内容を確認してください';
      
      setError(errorMessage);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // まずオファーを作成してIDを取得
      const offerData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        rank: formData.rank,
        skills: formData.skills, // 選択されたスキルIDの配列
        deadline: formData.deadline || null,
        salary: formData.salary.trim() || null,
        capacity: formData.capacity || null
      };

      console.log('=== Creating Offer ===');
      console.log('Offer data:', offerData);
      console.log('API Endpoint:', API_ENDPOINTS.OFFERS_MY_CREATE);
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'No token');

      const response = await fetch(API_ENDPOINTS.OFFERS_MY_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        throw new Error(errorData.detail || `HTTP ${response.status}: オファーの作成に失敗しました`);
      }

      const result = await response.json();
      const offerId = result.offer_id; // バックエンドから返されるオファーID

      // 画像がアップロードされている場合、オファーIDをファイル名としてstorageバケットに移動
      if (tempImageUuid && imageFile && offerId) {
        try {
          const fileExtension = imageFile.name.split('.').pop();
          const tempFileName = `${tempImageUuid}.${fileExtension}`;
          const newFileName = offerId; // 拡張子を削除してオファーIDのみを使用

          const moveResponse = await fetch(
            `${API_ENDPOINTS.MINIO_MOVE_TEMP_TO_STORAGE(tempFileName)}?new_file_name=${newFileName}`,
            {
              method: 'POST',
            }
          );

          if (!moveResponse.ok) {
            console.warn('画像の保存に失敗しましたが、オファーは正常に作成されました');
          } else {
            console.log('画像が正常にstorageバケットに保存されました（拡張子削除）');
          }
        } catch (err) {
          console.warn('画像の処理に失敗しましたが、オファーは正常に作成されました:', err);
        }
      }

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
            <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                    label="オファータイトル"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={!!validationErrors.title}
                    helperText={validationErrors.title || 'わかりやすく魅力的なタイトルを入力してください'}
                    placeholder="例: 【リモート可】フルスタックエンジニア募集 - 最新技術で事業成長を支える"
                    required
                    InputProps={{
                      sx: {
                        minWidth: "16vw", 
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
                        minWidth: "26vw", 
                        borderRadius: 2,
                        background: 'white',
                        '& .MuiInputBase-inputMultiline': {
                          resize: 'vertical',
                          overflow: 'auto'
                        }
                      }
                    }}
                    FormHelperTextProps={{
                      sx: {
                        margin: '3px 14px 0 14px',
                        lineHeight: '1.4'
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
                  
                  <Grid container spacing={3} sx={{ display: 'flex', flexFlow: 'column' }}>
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
                    <Grid item xs={12} md={6} sx={{ width: '100%' }}>
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


                    {/* 必要スキル */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!validationErrors.skills}>
                        <InputLabel sx={{ fontWeight: 'bold' }}>必要スキル</InputLabel>
                        <Select
                          multiple
                          value={formData.skills}
                          onChange={(e) => handleInputChange('skills', e.target.value)}
                          input={<OutlinedInput label="必要スキル" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((skillId) => {
                                const skill = availableSkills.find(s => s.skill_id === skillId);
                                return (
                                  <Chip
                                    key={skillId}
                                    label={skill?.skill_name || skillId}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                );
                              })}
                            </Box>
                          )}
                          sx={{ 
                            borderRadius: 2,
                            background: 'white'
                          }}
                          disabled={skillsLoading}
                        >
                          {skillsLoading ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              スキルを読み込み中...
                            </MenuItem>
                          ) : (
                            availableSkills.map((skill) => (
                              <MenuItem key={skill.skill_id} value={skill.skill_id}>
                                <Checkbox 
                                  checked={formData.skills.indexOf(skill.skill_id) > -1}
                                  sx={{ p: 0.5 }}
                                />
                                <ListItemText 
                                  primary={skill.skill_name}
                                  sx={{ ml: 1 }}
                                />
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {validationErrors.skills && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {validationErrors.skills}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* 画像アップロードセクション */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: validationErrors.image 
                      ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
                      : 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                    border: validationErrors.image 
                      ? '2px solid #f44336'
                      : '1px solid #81c784'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: validationErrors.image ? '#d32f2f' : '#2e7d32' }}>
                    📷 オファー画像 *
                  </Typography>
                  
                  {validationErrors.image && (
                    <Typography 
                      variant="body2" 
                      color="error" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 'bold',
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: 'rgba(244, 67, 54, 0.1)'
                      }}
                    >
                      {validationErrors.image}
                    </Typography>
                  )}
                  
                  {uploadedImage ? (
                    // アップロード済み画像の表示
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Card sx={{ maxWidth: 400, borderRadius: 3 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={uploadedImage}
                          alt="アップロード画像"
                          sx={{ objectFit: 'cover' }}
                        />
                      </Card>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Delete />}
                          onClick={handleImageRemove}
                          sx={{
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                              borderColor: '#d32f2f',
                              backgroundColor: '#ffebee'
                            }
                          }}
                        >
                          画像を削除
                        </Button>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="image-upload-replace"
                          type="file"
                          onChange={handleImageSelect}
                        />
                        <label htmlFor="image-upload-replace">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                            sx={{
                              borderColor: '#2e7d32',
                              color: '#2e7d32',
                              '&:hover': {
                                borderColor: '#1b5e20',
                                backgroundColor: '#e8f5e8'
                              }
                            }}
                          >
                            画像を変更
                          </Button>
                        </label>
                      </Box>
                    </Box>
                  ) : (
                    // 画像アップロード部分
                    <Box
                      sx={{
                        border: validationErrors.image 
                          ? '2px dashed #f44336'
                          : '2px dashed #81c784',
                        borderRadius: 3,
                        p: 4,
                        textAlign: 'center',
                        background: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: validationErrors.image ? '#d32f2f' : '#4caf50',
                          backgroundColor: validationErrors.image ? '#ffebee' : '#f1f8e9'
                        }
                      }}
                    >
                      {imageUploading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={40} color="success" />
                          <Typography variant="body1" color="text.secondary">
                            画像をアップロード中...
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <ImageIcon sx={{ 
                            fontSize: '4rem', 
                            color: validationErrors.image ? '#f44336' : '#81c784', 
                            mb: 2 
                          }} />
                          <Typography variant="h6" fontWeight="bold" sx={{ 
                            mb: 1, 
                            color: validationErrors.image ? '#d32f2f' : '#2e7d32' 
                          }}>
                            画像をアップロード（必須）
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            JPG, PNG, GIF形式、5MB以下のファイルをアップロードしてください
                          </Typography>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            type="file"
                            onChange={handleImageSelect}
                          />
                          <label htmlFor="image-upload">
                            <Button
                              variant="contained"
                              component="span"
                              startIcon={<CloudUpload />}
                              sx={{
                                background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)',
                                }
                              }}
                            >
                              ファイルを選択
                            </Button>
                          </label>
                        </>
                      )}
                    </Box>
                  )}
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
