import React from 'react'
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Chip
} from '@mui/material';
import {
  Add,
  Work,
  Dashboard,
  Business,
  Assignment,
  BarChart
} from '@mui/icons-material';
import flow2 from '../images/flow_02.png'
import flow3 from '../images/flow_03.png'

function App() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          p: 3
        }}
      >

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* ウェルカムセクション */}
        <Paper 
          elevation={6}
          sx={{ 
            p: 4, 
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #fff 30%, #f8f9fa 90%)',
            textAlign: 'center'
          }}
        >
          <Chip 
            icon={<Business />}
            label="企業管理ダッシュボード"
            color="primary"
            sx={{ 
              mb: 3, 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              px: 3,
              py: 2
            }}
          />
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            🎯 優秀な人材との出会いを始めましょう
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            ぱいざの企業管理画面へようこそ。新しい募集を作成したり、既存のオファーを管理したりできます。
          </Typography>
        </Paper>

        {/* メインアクションカード */}
        <Grid container spacing={4}>
          {/* 新規募集作成 */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={6}
              sx={{ 
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(255, 106, 0, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 3 }}>
                  <Box 
                    sx={{                      width: 120,
                      height: 120,
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
                    <Add sx={{ fontSize: '3rem', color: 'white' }} />
                  </Box>
                  <img 
                    src={flow3} 
                    alt="募集フォーム作成"
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      objectFit: 'contain',
                      marginBottom: '16px'
                    }}
                  />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                  📝 募集フォーム新規作成
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                  新しいプロジェクトやインターンシップの募集を作成して、優秀な人材を見つけましょう。
                </Typography>
                
                <Button
                  component={Link}
                  to="#"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Assignment />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #ff6a00 30%, #ff9a56 90%)',
                    boxShadow: '0 4px 20px rgba(255, 106, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #e55a00 30%, #ff6a00 90%)',
                      boxShadow: '0 6px 25px rgba(255, 106, 0, 0.4)',
                    }
                  }}
                >
                  🚀 新規募集を作成
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* オファーページ管理 */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={6}
              sx={{ 
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(255, 106, 136, 0.2)',
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 3 }}>
                  <Box 
                    sx={{ 
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #ff6a88 30%, #ff9a56 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 25px rgba(255, 106, 136, 0.3)'
                    }}
                  >
                    <Work sx={{ fontSize: '3rem', color: 'white' }} />
                  </Box>
                  <img 
                    src={flow2} 
                    alt="オファーページ"
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      objectFit: 'contain',
                      marginBottom: '16px'
                    }}
                  />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                  📊 オファーページ管理
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                  既存の募集を確認・編集したり、応募者の管理を行うことができます。
                </Typography>
                
                <Button
                  component={Link}
                  to="/offer"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<Dashboard />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #ff6a88 30%, #ff9a56 90%)',
                    boxShadow: '0 4px 20px rgba(255, 106, 136, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #e55a78 30%, #ff6a88 90%)',
                      boxShadow: '0 6px 25px rgba(255, 106, 136, 0.4)',
                    }
                  }}
                >
                  📈 オファー管理画面へ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 統計カード */}
          </Container>
    </Box>
  );
}

export default App

