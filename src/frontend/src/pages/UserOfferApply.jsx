import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { API_ENDPOINTS } from '../config/api';
import "../css/UserCaseDetails.css";

function UserOfferApply() {
  const { offer_id } = useParams();
  const navigate = useNavigate();
  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 応募処理
  const handleApply = () => {
    // TODO: 実際の応募APIを呼び出す
    alert('応募が完了しました！');
    navigate('/user/list');
  };

  // 戻る処理
  const handleCancel = () => {
    navigate(`/user/offer/${offer_id}`);
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
      <Box sx={{ textAlign: 'center', width: '100%', maxWidth: 600, mx: 'auto' }}>
        {/* 確認メッセージ */}
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
          応募確認
        </Typography>
        
        {/* オファー情報 */}
        <Box sx={{ 
          p: 3, 
          mb: 4, 
          border: '2px solid #e3f2fd', 
          borderRadius: 2,
          backgroundColor: '#f8f9fa'
        }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
            {offerData.offer_title}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1, color: '#666' }}>
            {offerData.enterprise_name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#888' }}>
            ランク: {offerData.rank}
          </Typography>
        </Box>

        {/* 確認メッセージ */}
        <Typography variant="h6" sx={{ mb: 4, lineHeight: 1.6 }}>
          上記のオファーに応募しますか？
        </Typography>

        {/* ボタン */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleCancel}
            sx={{
              minWidth: 150,
              py: 2,
              fontSize: '1.1rem',
              borderRadius: "30px",
              borderColor: '#666',
              color: '#666',
              "&:hover": {
                borderColor: '#333',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            戻る
          </Button>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleApply}
            sx={{
              minWidth: 150,
              py: 2,
              fontSize: '1.1rem',
              backgroundColor: "#4fc3f7",
              color: "white",
              borderRadius: "30px",
              "&:hover": {
                backgroundColor: "#29b6f6",
              },
              "&:focus": {
                outline: "none",
              },
            }}
          >
            応募する
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default UserOfferApply;
