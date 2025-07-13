import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Avatar,
} from "@mui/material";
import {
  Search,
  Person,
  Business,
  Star,
  TrendingUp,
  WorkOutline,
  AccountCircle,
  Assignment,
  Dashboard,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#1976d2", fontWeight: "bold" }}
          >
            🔄 読み込み中...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (isAuthenticated) {
    if (user.enterprise_id == null) {
      // 一般ユーザーの場合はエラーメッセージを表示
      navigate("/user/list");
    } else {
      // 企業ユーザーの場合は企業ダッシュボードにリダイレクト
      navigate("/enterprise");
    }
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {" "}
      {/* ヘッダー */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* ヒーローセクション */}
        <Paper
          elevation={6}
          sx={{
            p: 6,
            mb: 6,
            borderRadius: 4,
            background: "linear-gradient(45deg, #fff 30%, #f8f9fa 90%)",
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Chip
              icon={<Star />}
              label="スキルマッチングプラットフォーム"
              color="primary"
              sx={{
                mb: 3,
                fontSize: "1.1rem",
                fontWeight: "bold",
                px: 3,
                py: 2,
              }}
            />
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #424242, #757575)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
            }}
          >
            🎯 スキル・求人マッチング
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.5 }}
          >
            あなたのスキルを活かせる理想の仕事を見つけよう
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip label="💻 プログラミング" variant="outlined" />
            <Chip label="🎨 デザイン" variant="outlined" />
            <Chip label="📊 データ分析" variant="outlined" />
            <Chip label="📝 ライティング" variant="outlined" />
            <Chip label="🌐 多言語対応" variant="outlined" />
          </Box>
        </Paper>

        {isAuthenticated ? (
          /* 認証済みユーザー向けダッシュボード */
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
            少々お待ち下さい
          </Typography>
        ) : (
          /* 未認証ユーザー向けCTA */
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ mx: 'auto' }}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                  🚀
                  アカウントを作成して、あなたにぴったりの求人を見つけましょう
                </Typography>

                <Grid container spacing={4}>
                  {/* 求職者向け */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        background:
                          "linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Person
                          sx={{ fontSize: "3rem", color: "#1976d2", mb: 2 }}
                        />
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="primary"
                          sx={{ mb: 2 }}
                        >
                          👨‍💻 求職者の方
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          スキルを活かせる理想の仕事を見つけましょう
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
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
                            fontWeight: "bold",
                            background:
                              "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
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
                            fontWeight: "bold",
                            borderColor: "#1976d2",
                            color: "#1976d2",
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
                        background:
                          "linear-gradient(45deg, #fff3e0 30%, #ffcc80 90%)",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ mb: 3 }}>
                        <Business
                          sx={{ fontSize: "3rem", color: "#ff9800", mb: 2 }}
                        />
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="warning.main"
                          sx={{ mb: 2 }}
                        >
                          🏢 企業の方
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          優秀な人材を見つけて、チームを強化しましょう
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
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
                            fontWeight: "bold",
                            background:
                              "linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)",
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
                            fontWeight: "bold",
                            borderColor: "#ff9800",
                            color: "#ff9800",
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

      </Container>
    </Box>
  );
}

export default Home;
