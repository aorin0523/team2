import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

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

function UserOfferDetail() {
  const { offer_id } = useParams();
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ratingValue = 3;

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
          <p>{offerData.enterprise_name}</p>
          <Typography component="legend"></Typography>
          <Rating name="read-only" value={ratingValue} readOnly />
          <p>ランク: {offerData.rank}</p>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4fc3f7",
              color: "white",
              borderRadius: "30px",
              "&:focus": {
                outline: "none",
              },
            }}
          >
            質問する
          </Button>
        </Box>
        <Box className="work-outline">
          <h2>{offerData.offer_title}</h2>
          <p>
            {offerData.offer_content.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
          {offerData.salary && (
            <p><strong>給与:</strong> {offerData.salary}</p>
          )}
          {offerData.capacity && (
            <p><strong>募集人数:</strong> {offerData.capacity}人</p>
          )}
          {offerData.skills && offerData.skills.length > 0 && (
            <div>
              <strong>必要スキル:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                {offerData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.9rem',
                      border: '1px solid #bbdefb'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Button
            variant="contained"
            sx={{
              width: "80%",
              backgroundColor: "#4fc3f7",
              color: "white",
              borderRadius: "30px",
              mt: 3,
              "&:focus": {
                outline: "none",
              },
            }}
          >
            応募する
          </Button>
        </Box>
      </Box>
  );
}

export default UserOfferDetail;
