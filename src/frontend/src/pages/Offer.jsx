import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import "../css/offer.css";

function Offer() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // オファーデータを取得
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);

        // デバッグ用：詳細な情報を出力
        console.log("=== Offer Page Debug Info ===");
        console.log("Token exists:", !!token);
        console.log("Token value:", token?.substring(0, 20) + "...");
        console.log("User object:", user);
        console.log("User enterprise_id:", user?.enterprise_id);
        console.log("Is enterprise user:", !!user?.enterprise_id);
        console.log("API Endpoint:", API_ENDPOINTS.OFFERS_MY_LIST);

        if (!token) {
          console.error("No token available");
          setError("認証が必要です。ログインしてください。");
          setLoading(false);
          return;
        }

        if (!user?.enterprise_id) {
          console.error("User is not an enterprise user:", user);
          setError("企業アカウントが必要です。");
          setLoading(false);
          return;
        }

        console.log("Making API request...");
        const response = await fetch(API_ENDPOINTS.OFFERS_MY_LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API Response status:", response.status);
        console.log(
          "API Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error response:", errorText);

          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { detail: errorText };
          }

          if (response.status === 401) {
            setError("認証が無効です。再度ログインしてください。");
          } else if (response.status === 403) {
            setError("企業アカウントとしてのアクセス権限がありません。");
          } else {
            setError(
              errorData.detail || `APIエラー (${response.status}): ${errorText}`
            );
          }
          return;
        }

        const data = await response.json();
        console.log("API Response data:", data);
        console.log(
          "Data type:",
          typeof data,
          "Is array:",
          Array.isArray(data)
        );

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", typeof data, data);
          setError("APIから無効なデータ形式が返されました。");
          return;
        }

        // バックエンドのデータ構造をフロントエンド用に変換
        const transformedOffers = data.map((offer) => {
          console.log("Transforming offer:", offer);
          return {
            id: offer.offer_id,
            title: offer.offer_title,
            content: offer.offer_content,
            rank: offer.rank,
            salary: offer.salary,
            capacity: offer.capacity,
            deadline: offer.deadline,
            skills: offer.skills || [],
            status: "募集中",
          };
        });

        console.log("Transformed offers:", transformedOffers);

        setOffers(transformedOffers);
        if (transformedOffers.length > 0) {
          setSelectedOffer(transformedOffers[0].id);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`エラーが発生しました: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // 認証情報が揃ってからAPIコールを実行
    if (token && user) {
      fetchOffers();
    } else {
      console.log("Waiting for authentication...", {
        token: !!token,
        user: !!user,
      });
      // token または user が無い場合は少し待ってから再チェック
      const timeout = setTimeout(() => {
        if (!token) {
          setError("認証が必要です。ログインしてください。");
          setLoading(false);
        } else if (!user?.enterprise_id) {
          setError("企業アカウントが必要です。");
          setLoading(false);
        }
      }, 2000); // 2秒待つ

      return () => clearTimeout(timeout);
    }
  }, [token, user]);

  // 日付を日本語形式にフォーマット
  const formatDate = (dateString) => {
    if (!dateString) return "未設定";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 新規作成ボタンのクリック処理
  const handleCreateOffer = () => {
    navigate("/enterprise/offer/create");
  };

  // 詳細表示ボタンのクリック処理
  const handleViewDetail = (offerId) => {
    navigate(`/enterprise/offer/${offerId}`);
  };

  // ランクに対応する色を取得

  const getRankColor = (rank) => {
    switch (rank) {
      case "A":
        return "error";
      case "B":
        return "warning";
      case "C":
        return "info";
      default:
        return "default";
    }
  };
  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* ページタイトル */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            color: "#424242",
          }}
        >
          <Typography variant="h3" align="center" fontWeight="bold">
            🎯 オファー管理ページ
          </Typography>
          <Typography variant="h6" align="center" sx={{ mt: 1, opacity: 0.9 }}>
            あなたが投稿した募集案件を管理・確認できます
          </Typography>
        </Paper>
        {/* ローディング状態 */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              オファーを読み込んでいます...
            </Typography>
          </Box>
        )}
        {/* エラー状態 */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {/* オファーが存在しない場合 */}
        {!loading && !error && offers.length === 0 && (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, #fff3e0 0%, #ffcc02 20%, #fff3e0 100%)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 2, color: "#e65100" }}
            >
              📝 まだオファーが投稿されていません
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#bf360c" }}>
              新しいオファーを作成して、優秀な人材を募集しましょう
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateOffer}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: "1.2rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)",
                boxShadow: "0 3px 15px rgba(255, 107, 53, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #e55a2b 30%, #d67c1a 90%)",
                  boxShadow: "0 5px 20px rgba(255, 107, 53, 0.4)",
                },
              }}
            >
              ➕ 最初のオファーを作成
            </Button>
          </Paper>
        )}{" "}
        {/* オファーカード一覧 */}
        {!loading && !error && offers.length > 0 && (
          <Grid container spacing={3}>
            {offers.map((offer) => (
              <Grid item xs={12} key={offer.id} width={"stretch"}>
                <Card
                  elevation={selectedOffer === offer.id ? 8 : 3}
                  sx={{
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    border:
                      selectedOffer === offer.id
                        ? "3px solid #1976d2"
                        : "1px solid #e0e0e0",
                    minHeight: 200,
                    height: "auto",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={() => setSelectedOffer(offer.id)}
                >
                  {" "}
                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    {/* 左側：基本情報 */}
                    <Box sx={{ flex: 1 }}>
                      {/* ステータスチップ */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          mb: 2,
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={offer.status}
                          color="success"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                        <Chip
                          label={`ランク ${offer.rank}`}
                          color={getRankColor(offer.rank)}
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>

                      {/* タイトル */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          color: "#1976d2",
                          lineHeight: 1.3,
                        }}
                      >
                        {offer.title}
                      </Typography>
                    </Box>

                    {/* 中央：詳細情報 */}
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mr: 1 }}
                        >
                          👥 募集人数:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {offer.capacity ? `${offer.capacity}名` : "制限なし"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mr: 1 }}
                        >
                          📅 締め切り:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatDate(offer.deadline)}
                        </Typography>
                      </Box>
                      {offer.salary && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mr: 1 }}
                          >
                            💰 給与:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {offer.salary}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* 右側：アクションボタン */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        minWidth: 200,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(offer.id);
                        }}
                        sx={{
                          borderRadius: 2,
                          fontWeight: "bold",
                          background:
                            "linear-gradient(45deg, #424242 30%, #757575 90%)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #212121 30%, #424242 90%)",
                          },
                        }}
                      >
                        📋 詳細表示
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          fontWeight: "bold",
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": {
                            borderColor: "#1565c0",
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        ✏️ 編集
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {/* 新規作成ボタン */}
        {!loading && !error && offers.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateOffer}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: "1.2rem",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #757575 30%, #9e9e9e 90%)",
                boxShadow: "0 3px 15px rgba(117, 117, 117, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #616161 30%, #757575 90%)",
                  boxShadow: "0 5px 20px rgba(117, 117, 117, 0.4)",
                },
              }}
            >
              ➕ 新しいオファーを作成
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Offer;
