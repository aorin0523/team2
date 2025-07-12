import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Search,
  Person,
  Business,
  Star,
  TrendingUp,
  WorkOutline,
  AccountCircle,
  Assignment,
  Dashboard
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            🔄 読み込み中...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >      {/* ヘッダー */}
      <AppBar position="static" sx={{ backgroundColor: 'rgba(66, 66, 66, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🥧 ぱいざ - スキルマッチングプラットフォーム
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" component={Link} to="/signin" sx={{ fontWeight: 'bold' }}>
                ログイン
              </Button>
              <Button color="inherit" component={Link} to="/signup" sx={{ fontWeight: 'bold' }}>
                登録
              </Button>
            </Box>
          )}
          {isAuthenticated && (
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* ヒーローセクション */}
        <Paper 
          elevation={6}
          sx={{ 
            p: 6, 
            mb: 6,
            borderRadius: 4,
            background: 'linear-gradient(45deg, #fff 30%, #f8f9fa 90%)',
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Chip 
              icon={<Star />}
              label="スキルマッチングプラットフォーム"
              color="primary"
              sx={{ 
                mb: 3, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                px: 3,
                py: 2
              }}
            />
          </Box>
          
          <Typography 
            variant="h2" 
            component="h1"            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #424242, #757575)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            🎯 スキル・求人マッチング
          </Typography>
          
          <Typography variant="h5" component="h2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.5 }}>
            あなたのスキルを活かせる理想の仕事を見つけよう
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="💻 プログラミング" variant="outlined" />
            <Chip label="🎨 デザイン" variant="outlined" />
            <Chip label="📊 データ分析" variant="outlined" />
            <Chip label="📝 ライティング" variant="outlined" />
            <Chip label="🌐 多言語対応" variant="outlined" />
          </Box>
        </Paper>

        {isAuthenticated ? (
          /* 認証済みユーザー向けダッシュボード */
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={6}
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(25, 118, 210, 0.2)',
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box                    sx={{ 
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #757575 30%, #9e9e9e 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(117, 117, 117, 0.3)'
                    }}
                  >
                    <Search sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  
                  <Typography variant="h5" component="h3" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                    🔍 求人を探す
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    あなたのスキルにマッチした求人を検索
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/offer"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    }}
                  >
                    求人一覧へ
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={6}
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(76, 175, 80, 0.2)',
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                    }}
                  >
                    <Person sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  
                  <Typography variant="h5" component="h3" fontWeight="bold" color="success.main" sx={{ mb: 2 }}>
                    👤 プロフィール
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    あなたの情報とスキルを管理
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/profile"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    }}
                  >
                    プロフィール編集
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                elevation={6}
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(255, 152, 0, 0.2)',
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)'
                    }}
                  >
                    <Business sx={{ fontSize: '2rem', color: 'white' }} />
                  </Box>
                  
                  <Typography variant="h5" component="h3" fontWeight="bold" color="warning.main" sx={{ mb: 2 }}>
                    🏢 企業向け
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    人材を探している企業の方はこちら
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/enterprise"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                    }}
                  >
                    企業ページへ
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* 未認証ユーザー向けCTA */
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper 
                elevation={6}
                sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  background: 'white',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                  🚀 アカウントを作成して、あなたにぴったりの求人を見つけましょう
                </Typography>
                
                <Grid container spacing={4}>
                  {/* 求職者向け */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={3}
                      sx={{ 
                        p: 4, 
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Person sx={{ fontSize: '3rem', color: '#1976d2', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                          👨‍💻 求職者の方
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                          スキルを活かせる理想の仕事を見つけましょう
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          component={Link} 
                          to="/signup"
                          startIcon={<Assignment />}
                          fullWidth
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                          }}
                        >
                          🎯 今すぐ登録
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="large" 
                          component={Link} 
                          to="/signin"
                          fullWidth
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                          }}
                        >
                          🔐 ログイン
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* 企業向け */}
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={3}
                      sx={{ 
                        p: 4, 
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #fff3e0 30%, #ffcc80 90%)',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Business sx={{ fontSize: '3rem', color: '#ff9800', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" color="warning.main" sx={{ mb: 2 }}>
                          🏢 企業の方
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                          優秀な人材を見つけて、チームを強化しましょう
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          component={Link} 
                          to="/enterprise/signup"
                          startIcon={<Business />}
                          fullWidth
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                          }}
                        >
                          🏆 企業登録
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="large" 
                          component={Link} 
                          to="/enterprise/signin"
                          fullWidth
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 'bold',
                            borderColor: '#ff9800',
                            color: '#ff9800',
                          }}
                        >
                          🔐 企業ログイン
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* 統計セクション */}
        <Paper 
          elevation={6}
          sx={{ 
            p: 4, 
            mt: 6,
            borderRadius: 3,
            background: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 4, textAlign: 'center' }}>
            📊 プラットフォーム統計
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: '3rem', color: '#1976d2', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  1,234+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  アクティブな求人
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <WorkOutline sx={{ fontSize: '3rem', color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  5,678+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  登録ユーザー
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Dashboard sx={{ fontSize: '3rem', color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  890+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  マッチング成功
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home;
