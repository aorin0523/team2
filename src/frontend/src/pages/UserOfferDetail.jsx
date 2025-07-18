import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// アイコン
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// 画像
import business_man from "../img/business_man.png";
// css
import "../css/UserCaseDetails.css";
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

function UserOfferDetail() {
  const { offer_id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  // オファーデータを取得
  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.OFFERS_DETAIL(offer_id));
        
        if (!response.ok) {
          throw new Error('オファーの取得に失敗しました');
        }
        
        const data = await response.json();
        setOfferData(data);
      } catch (err) {
        setError(err.message);
        console.error('オファー詳細取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    if (offer_id) {
      fetchOfferData();
    }
  }, [offer_id]);

  // 応募状況をチェック
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user || !token || !offer_id) return;

      try {
        setCheckingStatus(true);
        const response = await fetch(API_ENDPOINTS.USER_APPLICATION_STATUS(user.id, offer_id), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApplicationStatus(data.applied);
          setFavoriteStatus(data.favorite);
        }
      } catch (err) {
        console.error('応募状況チェックエラー:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkApplicationStatus();
  }, [user, token, offer_id]);

  // 気になる状態を切り替える処理
  const handleToggleFavorite = async () => {
    if (!user || !token) {
      setError('ログインが必要です');
      return;
    }

    try {
      setTogglingFavorite(true);
      
      const response = await fetch(API_ENDPOINTS.USER_FAVORITE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          offer_id: offer_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '気になる状態の更新に失敗しました');
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        // 成功時は状態を切り替える
        setFavoriteStatus(!favoriteStatus);
      } else {
        throw new Error(result.message || '気になる状態の更新に失敗しました');
      }
    } catch (err) {
      setError(`エラー: ${err.message}`);
      console.error('気になる更新エラー:', err);
    } finally {
      setTogglingFavorite(false);
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
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
          onClick={() => window.location.reload()}
        >
          再読み込み
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
      </Box>
    );
  }

  return (
      <Box component="main" className="container" sx={{ flexGrow: 1 }}>
        <Box className="client">
          <img 
            src={API_ENDPOINTS.MINIO_DOWNLOAD('storage', offer_id)} 
            alt="オファー画像"
            onError={(e) => {
              e.target.src = business_man; // 画像読み込み失敗時はデフォルト画像を表示
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
            {offerData.enterprise_name}
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            ランク: {offerData.rank}
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleToggleFavorite}
            disabled={togglingFavorite || !user}
            sx={{
              width: "60%",
              backgroundColor: favoriteStatus ? "#ff6b6b" : "#aaaaaa",
              color: "white",
              borderRadius: "30px",
              mt: 3,
              "&:hover": {
                backgroundColor: favoriteStatus ? "#ff5252" : "#999999",
              },
              "&:focus": {
                outline: "none",
              },
              "&:disabled": {
                backgroundColor: "#cccccc",
              },
            }}
          >
            {togglingFavorite ? "更新中..." : favoriteStatus ? "気になる済み" : "気になる"}
          </Button>
        </Box>
        <Box className="work-outline">
          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
            {offerData.offer_title}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>
            {offerData.offer_content.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Typography>
          {offerData.salary && (
            <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 2, fontWeight: 'bold' }}>
              <strong>給与:</strong> {offerData.salary}
            </Typography>
          )}
          {offerData.capacity && (
            <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 2 }}>
              <strong>募集人数:</strong> {offerData.capacity}人
            </Typography>
          )}
          {offerData.skills && offerData.skills.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>
                必要スキル:
              </Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {offerData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      border: '1px solid #bbdefb'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Box>
          )}
          {/* 応募ボタン */}
          {user ? (
            applicationStatus === true ? (
              <Button
                variant="contained"
                disabled
                sx={{
                  width: "100%",
                  backgroundColor: "#ccc",
                  color: "white",
                  borderRadius: "30px",
                  mt: 3,
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                応募済み
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate(`/user/offer/${offer_id}/apply`)}
                disabled={checkingStatus}
                sx={{
                  width: "100%",
                  backgroundColor: "#4fc3f7",
                  color: "white",
                  borderRadius: "30px",
                  mt: 3,
                  "&:hover": {
                    backgroundColor: "#29b6f6",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                {checkingStatus ? "確認中..." : "応募する"}
              </Button>
            )
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate('/signin')}
              sx={{
                width: "100%",
                borderColor: "#4fc3f7",
                color: "#4fc3f7",
                borderRadius: "30px",
                mt: 3,
                "&:hover": {
                  borderColor: "#29b6f6",
                  backgroundColor: "#f0f8ff",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              ログインして応募する
            </Button>
          )}
        </Box>
      </Box>
  );
}

export default UserOfferDetail;
