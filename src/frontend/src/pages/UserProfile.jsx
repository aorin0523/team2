import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rank: 1,
    selectedSkills: []
  });

  // 利用可能なスキル一覧
  const [availableSkills, setAvailableSkills] = useState([]);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      setError('');
      
      try {
        // スキル一覧を取得
        const skillsResponse = await fetch(API_ENDPOINTS.USER_SKILLS_ALL);
        const skillsData = await skillsResponse.json();
        
        if (skillsData.status === 'success') {
          setAvailableSkills(skillsData.skills.map(skill => skill.name));
        }

        // ユーザープロファイルを取得（実際のAPIまたはサンプルデータ）
        if (user && user.id) {
          try {
            const profileResponse = await fetch(API_ENDPOINTS.USER_PROFILE(user.id));
            const profileData = await profileResponse.json();
            
            if (profileData.status === 'success') {
              const profile = profileData.profile;
              setFormData({
                name: profile.name || '',
                email: profile.email || '',
                rank: profile.rank || 1,
                selectedSkills: profile.skills || []
              });
            } else {
              // APIからデータが取得できない場合はサンプルデータを使用
              setFormData({
                name: user.name || 'サンプルユーザー',
                email: user.email || 'sample@example.com',
                rank: user.rank || 1,
                selectedSkills: ['JavaScript', 'React']
              });
            }
          } catch (apiError) {
            // API呼び出しが失敗した場合はサンプルデータを使用
            console.log('API呼び出し失敗、サンプルデータを使用:', apiError);
            setFormData({
              name: user.name || 'サンプルユーザー',
              email: user.email || 'sample@example.com',
              rank: user.rank || 1,
              selectedSkills: ['JavaScript', 'Python']  // データベースに存在するスキルのみ
            });
          }
        } else {
          // ユーザーがログインしていない場合のサンプルデータ
          setFormData({
            name: 'サンプルユーザー',
            email: 'sample@example.com',
            rank: 3,
            selectedSkills: ['JavaScript', 'Python', 'Java']  // データベースに存在するスキルのみ
          });
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
        setError('データの取得に失敗しました');
        // エラーが発生した場合もサンプルデータを設定
        if (availableSkills.length === 0) {
          setAvailableSkills([
            'JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 
            'TypeScript', 'Go'  // データベースにあるスキルのみ
          ]);
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      selectedSkills: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      if (user && user.id) {
        // 実際のAPIを呼び出してプロファイルを更新
        const response = await fetch(API_ENDPOINTS.USER_PROFILE_UPDATE(user.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rank: formData.rank,
            skills: formData.selectedSkills
          }),
        });

        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          setSuccess('プロフィールを更新しました！');
        } else {
          throw new Error(data.detail || 'プロフィールの更新に失敗しました');
        }
      } else {
        // ユーザーがログインしていない場合は模擬的な保存処理
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess('プロフィールを更新しました！（サンプルモード）');
        console.log('更新されたプロフィール:', formData);
      }
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      setError(error.message || 'プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getRankText = (rank) => {
    const rankMap = {
      1: 'D (入門レベル)',
      2: 'C (初級レベル)', 
      3: 'B (中級レベル)',
      4: 'A (上級レベル)',
      5: 'S (最高レベル)'
    };
    return rankMap[rank] || 'D (入門レベル)';
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          プロフィール編集
        </Typography>

        {pageLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 名前（読み取り専用） */}
            <TextField
              label="名前"
              name="name"
              value={formData.name}
              fullWidth
              variant="outlined"
              disabled
              helperText="名前は変更できません"
            />

            {/* メールアドレス（読み取り専用） */}
            <TextField
              label="メールアドレス"
              name="email"
              type="email"
              value={formData.email}
              fullWidth
              variant="outlined"
              disabled
              helperText="メールアドレスは変更できません"
            />

            {/* ランク */}
            <FormControl fullWidth>
              <InputLabel>ランク</InputLabel>
              <Select
                name="rank"
                value={formData.rank}
                onChange={handleInputChange}
                label="ランク"
              >
                <MenuItem value={1}>D (入門レベル)</MenuItem>
                <MenuItem value={2}>C (初級レベル)</MenuItem>
                <MenuItem value={3}>B (中級レベル)</MenuItem>
                <MenuItem value={4}>A (上級レベル)</MenuItem>
                <MenuItem value={5}>S (最高レベル)</MenuItem>
              </Select>
            </FormControl>

            {/* 現在のランク表示 */}
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                現在のランク: <strong>{getRankText(formData.rank)}</strong>
              </Typography>
            </Box>

            {/* スキル */}
            <FormControl fullWidth>
              <InputLabel>スキル</InputLabel>
              <Select
                multiple
                value={formData.selectedSkills}
                onChange={handleSkillChange}
                input={<OutlinedInput label="スキル" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#2196F3', 
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: '#1976D2',
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {availableSkills.map((skill) => (
                  <MenuItem 
                    key={skill} 
                    value={skill}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: '#2196F3 !important',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: '#1976D2 !important',
                      },
                      '&:hover': {
                        backgroundColor: '#E3F2FD',
                      }
                    }}
                  >
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 選択されたスキル数の表示 */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#E3F2FD', 
              borderRadius: 1, 
              border: '1px solid #2196F3' 
            }}>
              <Typography variant="body2" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                選択中のスキル: <strong style={{ color: '#2196F3' }}>{formData.selectedSkills.length}個</strong>
              </Typography>
            </Box>

            {/* 保存ボタン */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2, 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  更新中...
                </Box>
              ) : (
                'プロフィールを更新'
              )}
            </Button>

            {/* キャンセルボタン */}
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.history.back()}
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                color: '#666',
                borderColor: '#ddd',
                '&:hover': {
                  borderColor: '#999',
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              ← 戻る
            </Button>
          </Box>
        </form>
        </>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
