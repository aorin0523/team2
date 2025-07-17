import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const ApplicantsList = () => {
  const { offer_id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offerData, setOfferData] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    applicantId: null,
    applicantName: ''
  });

  // オファー詳細を取得
  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        if (!token) {
          setError('認証が必要です。ログインしてください。');
          return;
        }

        if (!user?.enterprise_id) {
          setError('企業アカウントが必要です。');
          return;
        }

        console.log('Fetching offer data for ID:', offer_id);
        
        const response = await fetch(API_ENDPOINTS.OFFERS_DETAIL(offer_id), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'オファーの取得に失敗しました');
        }

        const data = await response.json();
        console.log('Fetched offer data:', data);
        
        setOfferData({
          id: data.offer_id || offer_id,
          title: data.offer_title,
          company: data.enterprise_name,
          description: data.offer_content,
          requirements: data.skills ? data.skills.join(', ') : '',
          salary: data.salary || '応相談',
          deadline: data.deadline ? new Date(data.deadline).toLocaleDateString('ja-JP') : '未設定',
          capacity: data.capacity || 1,
          rank: data.rank
        });

      } catch (err) {
        console.error('Error fetching offer data:', err);
        setError(err.message);
      }
    };

    fetchOfferData();
  }, [offer_id, token, user]);

  // 応募者一覧を取得
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        if (!token || !user?.enterprise_id) {
          return;
        }

        console.log('Fetching applicants for offer ID:', offer_id);
        console.log('API URL:', API_ENDPOINTS.OFFER_APPLICANTS(offer_id));
        console.log('Token:', token ? 'exists' : 'missing');
        
        // 応募者一覧を取得するAPIエンドポイントを呼び出し
        const response = await fetch(API_ENDPOINTS.OFFER_APPLICANTS(offer_id), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched applicants data:', data);
          setApplicants(data.applicants || []);
        } else {
          console.warn('Failed to fetch applicants:', response.status);
          console.warn('Response:', response);
          try {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            setError('応募者一覧の取得に失敗しました: ' + (errorData.detail || response.statusText));
          } catch (jsonError) {
            console.error('Failed to parse error response:', jsonError);
            setError('応募者一覧の取得に失敗しました: ' + response.statusText);
          }
        }

      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('応募者一覧の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (offerData) {
      fetchApplicants();
    }
  }, [offer_id, token, user, offerData]);

  const handleGoBack = () => {
    navigate('/enterprise/offer');
  };

  const handleAssignClick = (applicantId, applicantName) => {
    setConfirmDialog({
      open: true,
      applicantId,
      applicantName
    });
  };

  const handleConfirmAssign = async () => {
    const { applicantId, applicantName } = confirmDialog;
    
    try {
      if (!token) {
        alert('認証が必要です。ログインしてください。');
        return;
      }
      
      // API呼び出し
      const response = await fetch(`${API_BASE_URL}/api/v1/users/offer/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: applicantId, offer_id }),
      });
      
      if (response.ok) {
        // 状態を更新
        setApplicants(prev =>
          prev.map(applicant =>
            applicant.user_id === applicantId
              ? { ...applicant, status: 'assigned' }
              : applicant
          )
        );

        // アサイン成功後に通知を送信
        try {
          const notificationData = {
            user_id: applicantId,
            type: 'assignment',
            title: 'プロジェクトアサインのお知らせ',
            message: `おめでとうございます！「${offerData?.title}」のプロジェクトにアサインされました。企業担当者からの詳細な連絡をお待ちください。`,
            offer_id: offer_id,
            enterprise_name: offerData?.company || '企業'
          };

          console.log('Sending notification:', notificationData);

          const notificationResponse = await fetch(API_ENDPOINTS.CREATE_NOTIFICATION, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData),
          });

          if (notificationResponse.ok) {
            console.log('通知が正常に送信されました');
          } else {
            console.warn('通知送信に失敗しましたが、アサインは成功しました');
          }
        } catch (notificationError) {
          console.warn('通知送信中にエラーが発生しましたが、アサインは成功しました:', notificationError);
        }

        alert(`${applicantName}さんをアサインしました`);
      } else {
        const errorData = await response.json();
        alert('アサインに失敗しました: ' + (errorData.detail || '')); 
      }
    } catch (err) {
      console.error('Error assigning applicant:', err);
      alert('アサインに失敗しました');
    } finally {
      setConfirmDialog({ open: false, applicantId: null, applicantName: '' });
    }
  };

  const handleCancelAssign = () => {
    setConfirmDialog({ open: false, applicantId: null, applicantName: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'assigned':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '審査中';
      case 'assigned':
        return 'アサイン済み';
      case 'rejected':
        return '不採用';
      default:
        return '不明';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ヘッダー部分 */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          オファー一覧に戻る
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          応募者一覧
        </Typography>
      </Box>

      {/* オファー情報カード */}
      {offerData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {offerData.title}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>企業名:</strong> {offerData.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>給与:</strong> {offerData.salary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>募集人数:</strong> {offerData.capacity}名
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>必要スキル:</strong> {offerData.requirements}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ランク:</strong> {offerData.rank}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>応募締切:</strong> {offerData.deadline}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* 応募者一覧 */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          応募者一覧 ({applicants.length}名)
        </Typography>
        
        {applicants.length === 0 ? (
          <Alert severity="info">まだ応募者がいません。</Alert>
        ) : (
          <List>
            {applicants.map((applicant, index) => (
              <React.Fragment key={applicant.user_id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">{applicant.name}</Typography>
                        <Chip
                          label={getStatusText(applicant.status)}
                          color={getStatusColor(applicant.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EmailIcon fontSize="small" />
                          <Typography variant="body2">{applicant.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <WorkIcon fontSize="small" />
                          <Typography variant="body2">
                            スキル: {applicant.skills.join(', ')}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          応募日時: {new Date(applicant.applied_at).toLocaleString('ja-JP')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {applicant.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AssignmentIcon />}
                        onClick={() => handleAssignClick(applicant.user_id, applicant.name)}
                        size="small"
                      >
                        アサイン
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < applicants.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* アサイン確認ダイアログ */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelAssign}
        aria-labelledby="assign-dialog-title"
        aria-describedby="assign-dialog-description"
      >
        <DialogTitle id="assign-dialog-title">
          応募者のアサイン確認
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="assign-dialog-description">
            <strong>{confirmDialog.applicantName}</strong> さんを
            <strong>「{offerData?.title}」</strong> のポジションにアサインしますか？
            <br /><br />
            アサイン後は以下の処理が行われます：
            <br />
            • 採用が確定し、該当ユーザーに通知が送信されます
            <br />
            • この操作は取り消すことができません
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAssign} color="inherit">
            キャンセル
          </Button>
          <Button 
            onClick={handleConfirmAssign} 
            color="primary" 
            variant="contained"
            autoFocus
          >
            アサインする
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicantsList;
