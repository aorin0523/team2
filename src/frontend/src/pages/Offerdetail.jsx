import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Schedule,
  Group,
  Star,
  CalendarToday,
  Assignment,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

function Offerdetail() {
  const navigate = useNavigate();
  const { offer_id } = useParams();
  const { token, user } = useAuth();
  
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationsData, setApplicationsData] = useState({
    applications: 0,
    capacity: 0
  });

  // オファーデータを取得
  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          setError('認証が必要です。ログインしてください。');
          return;
        }

        if (!user?.enterprise_id) {
          setError('企業アカウントが必要です。');
          return;
        }

        console.log('Fetching offer data for ID:', offer_id);
        
        const response = await fetch(API_ENDPOINTS.OFFERS_DETAIL(offer_id), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.detail || 'オファーの取得に失敗しました');
        }

        const data = await response.json();
        console.log('Fetched offer data:', data);
          // バックエンドのデータ構造をフロントエンド用に変換
        const transformedData = {
          id: data.offer_id || offer_id,
          title: data.offer_title,
          company: data.enterprise_name,
          description: data.offer_content,
          requirements: data.skills ? data.skills.join(', ') : '',
          salary: data.salary || '応相談',
          deadline: data.deadline ? new Date(data.deadline).toLocaleDateString('ja-JP') : '未設定',
          applications: 0, // 応募者数は別途取得が必要
          capacity: data.capacity || 1,
          status: "募集中",
          rank: data.rank
        };
        
        setOfferData(transformedData);
        
        // 応募者数を取得
        try {
          const applicationsResponse = await fetch(API_ENDPOINTS.OFFER_APPLICATIONS_COUNT(offer_id), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            console.log('Applications count data:', applicationsData);
            
            setApplicationsData({
              applications: applicationsData.count || 0,
              capacity: transformedData.capacity
            });
            console.log('Updated applicationsData:', {
              applications: applicationsData.count || 0,
              capacity: transformedData.capacity
            });
          } else {
            console.warn('Failed to fetch applications count');
            setApplicationsData({
              applications: 0,
              capacity: transformedData.capacity
            });
          }
        } catch (applicationsErr) {
          console.warn('Error fetching applications count:', applicationsErr);
          setApplicationsData({
            applications: 0,
            capacity: transformedData.capacity
          });
        }
        
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (offer_id && token && user) {
      fetchOfferData();
    }
  }, [offer_id, token, user]);

  const progressPercentage = applicationsData.capacity > 0 
    ? (applicationsData.applications / applicationsData.capacity) * 100 
    : 0;

  // ローディング状態
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          オファー詳細を読み込み中...
        </Typography>
      </Box>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/enterprise/offer')}
        >
          オファー一覧に戻る
        </Button>
      </Box>
    );
  }

  // データが存在しない場合
  if (!offerData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          オファーが見つかりません
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/enterprise/offer')}
        >
          オファー一覧に戻る
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 3
      }}
    >
      <Container maxWidth="lg">
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
        >          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/enterprise/offer')}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
              📋 オファー詳細管理
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Group />}
              onClick={() => navigate(`/enterprise/offer/${offer_id}/applicants`)}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              応募者一覧
            </Button>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            募集の詳細情報と応募状況を確認できます
          </Typography>
        </Paper>

        <Grid container spacing={4} sx={{ display: 'flex', alignItems: 'stretch' }}>
          {/* メイン情報 */}
          <Grid item xs={12} md={8} sx={{ width: '100%' }}>
            <Card elevation={6} sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* タイトルと状況 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary" sx={{ flex: 1 }}>
                      {offerData.title}
                    </Typography>
                    <Chip 
                      label={offerData.status}
                      color="success"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    🏢 {offerData.company}
                  </Typography>
                </Box>                {/* 進捗バー */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    📊 応募状況: {applicationsData.applications}/{applicationsData.capacity}名
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: progressPercentage > 80 ? '#ff5722' : progressPercentage > 60 ? '#ff9800' : '#4caf50'
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    進捗率: {progressPercentage.toFixed(1)}%
                  </Typography>
                </Box>{/* 基本情報 */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney sx={{ mr: 1, color: '#4caf50' }} />
                      <Typography variant="body1">
                        <strong>給与:</strong> {offerData.salary}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ mr: 1, color: '#e91e63' }} />
                      <Typography variant="body1">
                        <strong>応募締切:</strong> {offerData.deadline}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* 詳細説明 */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    📝 募集内容
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                    {offerData.description}
                  </Typography>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    🛠️ 必要スキル
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {offerData.requirements}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* サイドバー */}
          <Grid item xs={12} md={4}  sx={{ marginX: 'auto' }}>
            <Card elevation={6} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  🎯 管理アクション
                </Typography>
                  <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Assignment />}
                  onClick={() => navigate(`/enterprise/offer/${offer_id}/applicants`)}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #424242 30%, #757575 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #212121 30%, #424242 90%)',
                    }
                  }}
                >
                  📋 応募者一覧
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderColor: '#424242',
                    color: '#424242',
                    '&:hover': {
                      borderColor: '#212121',
                      backgroundColor: 'rgba(66, 66, 66, 0.04)',
                    }
                  }}
                >
                  ✏️ 募集内容編集
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  color="error"
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  ⏸️ 募集停止
                </Button>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  💡 応募が集まったら早めの選考をおすすめします
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Offerdetail;
