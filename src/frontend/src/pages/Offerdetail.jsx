import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Business,
  Schedule,
  Group,
  Star,
  CalendarToday,
  Assignment,
  LocationOn,
  AttachMoney
} from '@mui/icons-material';

function Offerdetail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('recruiting');
  
  // サンプルオファーデータ
  const offerData = {
    id: 1,
    title: "フロントエンドエンジニア募集",
    company: "株式会社テックイノベーション",
    description: "React.jsを使用したWebアプリケーション開発に携わっていただきます。",
    requirements: "React.js, TypeScript, HTML/CSS",
    salary: "月給 300,000円〜500,000円",
    location: "東京都渋谷区",
    employmentType: "正社員",
    deadline: "2024年8月31日",
    applications: 12,
    capacity: 20,
    status: "募集中"
  };

  const progressPercentage = (offerData.applications / offerData.capacity) * 100;

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
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/enterprise/offer')}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight="bold">
              📋 オファー詳細管理
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            募集の詳細情報と応募状況を確認できます
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* メイン情報 */}
          <Grid item xs={12} md={8}>
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
                </Box>

                {/* 進捗バー */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    📊 応募状況: {offerData.applications}/{offerData.capacity}名
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
                </Box>

                {/* 基本情報 */}
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
                      <LocationOn sx={{ mr: 1, color: '#2196f3' }} />
                      <Typography variant="body1">
                        <strong>勤務地:</strong> {offerData.location}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Business sx={{ mr: 1, color: '#ff9800' }} />
                      <Typography variant="body1">
                        <strong>雇用形態:</strong> {offerData.employmentType}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ mr: 1, color: '#e91e63' }} />
                      <Typography variant="body1">
                        <strong>締切:</strong> {offerData.deadline}
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
          <Grid item xs={12} md={4}>
            <Card elevation={6} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  🎯 管理アクション
                </Typography>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Assignment />}
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