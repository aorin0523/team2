import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rating,
  Button,
  Box,
  Container,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  Typography
} from '@mui/material';

// アイコン
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssignmentIcon from '@mui/icons-material/Assignment';

import WorkIcon from '@mui/icons-material/Work';

// 画像
import business_man from '../img/business_man.png';

function App() {
    const ratingValue = 3;

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 4
            }}
        >
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Grid container spacing={4}>
                        {/* 左側: クライアント情報 */}
                        <Grid item xs={12} lg={4}>
                            <Paper 
                                elevation={6}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 3,
                                    background: 'linear-gradient(45deg, #fff 30%, #f8f9fa 90%)',
                                    height: 'fit-content'
                                }}
                            >
                                {/* クライアント情報ヘッダー */}
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Avatar 
                                        src={business_man}
                                        sx={{ 
                                            width: 100, 
                                            height: 100, 
                                            mx: 'auto', 
                                            mb: 2,
                                            border: '4px solid #e3f2fd'
                                        }}
                                    />
                                    <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                                        📊 クライアント情報
                                    </Typography>
                                </Box>

                                {/* クライアント詳細 */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                🏢 企業名
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                株式会社サンプル企業
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                👤 担当者
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                羽伊座太郎
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                📧 連絡先
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                haizatarou@sample.com
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                ⭐ 評価
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Rating value={ratingValue} readOnly />
                                                <Typography variant="body2" color="text.secondary">
                                                    ({ratingValue}.0)
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* 統計情報 */}
                                <Box sx={{ textAlign: 'left', mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            📋 募集件数
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold" color="primary">
                                            23件
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            ✅ 契約件数
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold" color="success.main">
                                            17件
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            🎯 完了件数
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold" color="warning.main">
                                            9件
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* アクションボタン */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<QuestionAnswerIcon />}
                                        sx={{
                                            borderRadius: 3,
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            background: 'linear-gradient(45deg, #424242 30%, #757575 90%)',
                                        }}
                                    >
                                        💬 メッセージ送信
                                    </Button>
                                    
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<AssignmentIcon />}
                                        sx={{
                                            borderRadius: 3,
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            borderColor: '#424242',
                                            color: '#424242',
                                        }}
                                    >
                                        📋 契約詳細
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* 右側: 案件詳細 */}
                        <Grid item xs={12} lg={8}>
                            <Paper 
                                elevation={6}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 3,
                                    background: 'linear-gradient(45deg, #fff 30%, #f8f9fa 90%)',
                                }}
                            >
                                {/* 案件タイトル */}
                                <Box sx={{ mb: 4 }}>
                                    <Chip 
                                        icon={<WorkIcon />}
                                        label="案件詳細"
                                        color="primary"
                                        sx={{ 
                                            mb: 2, 
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                    <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                                        💻 テストウェブサイトのコーディング
                                    </Typography>
                                </Box>

                                {/* 案件詳細説明 */}
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        p: 3, 
                                        mb: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef'
                                    }}
                                >
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            lineHeight: 1.8,
                                            color: '#495057',
                                            whiteSpace: 'pre-line'
                                        }}
                                    >
                                        添付された資料を基にテストウェブを完成させてください。
                                        
                                        【 応募時のお願い 】
                                        ・自己紹介や実績
                                        ・依頼してから納品までの流れ、所要時間
                                        こちらを記載していただけると助かります。
                                        
                                        【重視するポイント】
                                        スピード、柔軟な対応ができる方
                                        出来れば急ぎでほしいので、即納できますという方がいましたら大変ありがたいです。
                                        良くしていただいた際は今後何かあった時にまたご依頼したいと考えています。
                                        
                                        一定数の応募があった場合、締切前に打ち切る可能性がありますのでご了承ください。
                                        
                                        その他ご質問等ありましたら、気軽にお問い合わせください。
                                        よろしくお願いいたします。
                                    </Typography>
                                </Paper>

                                {/* プロジェクト詳細情報 */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                📅 開始予定日
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                即日開始可能
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                ⏰ 希望納期
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                相談による
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                💰 予算
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold" color="success.main">
                                                応相談
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                📊 応募状況
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                3名応募中
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* 技術要件 */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        🛠️ 必要スキル
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {['HTML/CSS', 'JavaScript', 'レスポンシブデザイン', 'コーディング', 'Web制作'].map((tech) => (
                                            <Chip 
                                                key={tech}
                                                label={tech}
                                                variant="outlined"
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    borderColor: '#424242',
                                                    color: '#424242'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                {/* 応募ボタン */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={<AssignmentIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        py: 2,
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #757575 30%, #9e9e9e 90%)',
                                        boxShadow: '0 4px 20px rgba(117, 117, 117, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #616161 30%, #757575 90%)',
                                            boxShadow: '0 6px 25px rgba(117, 117, 117, 0.4)',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    🚀 この案件に応募する
                                </Button>
                            </Paper>
                        </Grid>                    </Grid>
                </Container>
            </Box>
    );
}

export default App;
