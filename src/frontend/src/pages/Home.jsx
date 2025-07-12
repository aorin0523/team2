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
  CardContent
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography>読み込み中...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" component="h1" gutterBottom>
            スキル・求人マッチング
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
            あなたのスキルを活かせる仕事を見つけよう
          </Typography>
        </Box>

        {isAuthenticated ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    求人を探す
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    あなたのスキルにマッチした求人を検索
                  </Typography>
                  <Button variant="contained" component={Link} to="/offer">
                    求人一覧
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    プロフィール
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    あなたの情報とスキルを管理
                  </Typography>
                  <Button variant="contained">
                    プロフィール編集
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    企業向け
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    人材を探している企業の方はこちら
                  </Typography>
                  <Button variant="contained" component={Link} to="/enterprise">
                    企業ページ
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>        ) : (
          <Box textAlign="center">
            <Typography variant="body1" mb={3}>
              アカウントを作成して、あなたにぴったりの求人を見つけましょう
            </Typography>
            
            {/* 一般ユーザー向けボタン */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                求職者の方
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/signup"
                sx={{ mr: 2 }}
              >
                今すぐ登録
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/signin"
              >
                ログイン
              </Button>
            </Box>
            
            {/* 企業向けボタン */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                企業の方
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                size="large" 
                component={Link} 
                to="/enterprise/signup"
                sx={{ mr: 2 }}
              >
                企業登録
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                size="large" 
                component={Link} 
                to="/enterprise/signin"
              >
                企業ログイン
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}

export default Home;
