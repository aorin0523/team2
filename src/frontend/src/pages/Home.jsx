import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from "@mui/material";
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
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" sx={{ color: "#333" }}>
          読み込み中...
        </Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
    if (user.enterprise_id == null) {
      navigate("/user/list");
    } else {
      navigate("/enterprise");
    }
  }

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 2,
      }}
    >
      {/* Paizaロゴ */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#00a0a0",
            fontFamily: "Arial, sans-serif",
          }}
        >
          paiza
        </Typography>
      </Box>

      {/* メインタイトル */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#333",
          mb: 1,
          textAlign: "center",
        }}
      >
        キャリアアップサポート
      </Typography>

      {/* サブタイトル */}
      <Typography
        variant="h6"
        sx={{
          color: "#666",
          mb: 4,
          textAlign: "center",
        }}
      >
        スキルを活かせる理想の仕事を見つけよう
      </Typography>

      {/* メインコンテンツエリア */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* ユーザー側カード */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minWidth: "380px",
              maxWidth: "450px",
              p: 5,
              border: "2px solid #4A90E2",
              borderRadius: 2,
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                mb: 3,
              }}
            >
              ユーザー側
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              スキルを活かせる仕事を見つけよう
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/signup"
                fullWidth
                sx={{
                  borderColor: "#4A90E2",
                  color: "#4A90E2",
                  borderRadius: 1,
                  py: 1.5,
                  fontWeight: "normal",
                  "&:hover": {
                    borderColor: "#4A90E2",
                    backgroundColor: "#4A90E2",
                    color: "white",
                  },
                }}
              >
                新規登録
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/signin"
                fullWidth
                sx={{
                  borderColor: "#4A90E2",
                  color: "#4A90E2",
                  borderRadius: 1,
                  py: 1.5,
                  fontWeight: "normal",
                  "&:hover": {
                    borderColor: "#4A90E2",
                    backgroundColor: "#4A90E2",
                    color: "white",
                  },
                }}
              >
                ログイン
              </Button>
            </Box>
          </Paper>

          {/* 企業側カード */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minWidth: "380px",
              maxWidth: "450px",
              p: 5,
              border: "2px solid #FF9500",
              borderRadius: 2,
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                mb: 3,
              }}
            >
              企業側
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              優秀な人材を見つけて、チームを強化
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/enterprise/signup"
                fullWidth
                sx={{
                  borderColor: "#FF9500",
                  color: "#FF9500",
                  borderRadius: 1,
                  py: 1.5,
                  fontWeight: "normal",
                  "&:hover": {
                    borderColor: "#FF9500",
                    backgroundColor: "#FF9500",
                    color: "white",
                  },
                }}
              >
                新規登録
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/enterprise/signin"
                fullWidth
                sx={{
                  borderColor: "#FF9500",
                  color: "#FF9500",
                  borderRadius: 1,
                  py: 1.5,
                  fontWeight: "normal",
                  "&:hover": {
                    borderColor: "#FF9500",
                    backgroundColor: "#FF9500",
                    color: "white",
                  },
                }}
              >
                ログイン
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
