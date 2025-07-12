import React, { useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    Typography,
    Box,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,    AppBar,
    Toolbar,
    Chip,
    Avatar
} from '@mui/material';
import "../css/offer.css";

function Offer() {
    const [selectedOffer, setSelectedOffer] = useState(2);

    // オファーデータ
    const offers = [
        {
            id: 1,
            title: "Javaと React で創る、キャリアの第一歩！",
            applicants: "10人/12人",
            deadline: "7月15日",
            rank: "A",
            status: "募集中"
        },
        {
            id: 2,
            title: "未経験歓迎！手を動かして学ぶWebデザイン&開発",
            applicants: "6人/10人",
            deadline: "7月9日",
            rank: "C",
            status: "募集中"
        },
        {
            id: 3,
            title: "つながる技術、広がる可能性。未経験OKの開発インターン！",
            applicants: "2人/8人",
            deadline: "7月9日",
            rank: "C",
            status: "募集中"
        },
        {
            id: 4,
            title: "Python機械学習エンジニア養成プログラム",
            applicants: "15人/20人",
            deadline: "7月20日",
            rank: "A",
            status: "募集中"
        },
        {
            id: 5,
            title: "フロントエンド特化！Vue.js & Nuxt.js開発体験",
            applicants: "8人/15人",
            deadline: "7月12日",
            rank: "B",
            status: "募集中"
        },
        {
            id: 6,
            title: "クラウドインフラ構築＆運用エンジニア育成",
            applicants: "5人/10人",
            deadline: "7月18日",
            rank: "A",
            status: "募集中"
        },
        {
            id: 7,
            title: "モバイルアプリ開発！React Native実践講座",
            applicants: "12人/16人",
            deadline: "7月14日",
            rank: "B",
            status: "募集中"
        },
        {
            id: 8,
            title: "データサイエンティスト入門＆実践プロジェクト",
            applicants: "3人/8人",
            deadline: "7月25日",
            rank: "A",
            status: "募集中"
        },
        {
            id: 9,
            title: "ゲーム開発Unity体験！3Dゲーム制作入門",
            applicants: "9人/12人",
            deadline: "7月16日",
            rank: "B",
            status: "募集中"
        },
        {
            id: 10,
            title: "バックエンドAPI開発＆マイクロサービス設計",
            applicants: "4人/6人",
            deadline: "7月22日",
            rank: "A",
            status: "募集中"
        },
        {
            id: 11,
            title: "UI/UXデザイン思考＆プロトタイピング実習",
            applicants: "7人/10人",
            deadline: "7月11日",
            rank: "C",
            status: "募集中"
        },
        {
            id: 12,
            title: "ブロックチェーン技術入門＆DApp開発体験",
            applicants: "1人/5人",
            deadline: "7月30日",
            rank: "A",
            status: "募集中"
        }    ];

    const getRankColor = (rank) => {
        switch (rank) {
            case 'A': return 'error';
            case 'B': return 'warning';
            case 'C': return 'info';
            default: return 'default';
        }    };

    return (
        <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                {/* ページタイトル */}
                <Paper 
                    elevation={3}sx={{ 
                            p: 3, 
                            mb: 4, 
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            color: '#424242'
                        }}
                    >
                        <Typography variant="h3" align="center" fontWeight="bold">
                            🎯 オファー管理ページ
                        </Typography>
                        <Typography variant="h6" align="center" sx={{ mt: 1, opacity: 0.9 }}>
                            募集中の案件を管理・確認できます
                        </Typography>
                    </Paper>

                    {/* オファーカード一覧 */}
                    <Grid container spacing={3}>
                        {offers.map((offer) => (
                            <Grid item xs={12} md={6} lg={4} key={offer.id}>
                                <Card
                                    elevation={selectedOffer === offer.id ? 8 : 3}
                                    sx={{
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: selectedOffer === offer.id ? '3px solid #1976d2' : '1px solid #e0e0e0',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                        },
                                    }}
                                    onClick={() => setSelectedOffer(offer.id)}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        {/* ステータスチップ */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Chip
                                                label={offer.status}
                                                color="success"
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                            <Chip
                                                label={`ランク ${offer.rank}`}
                                                color={getRankColor(offer.rank)}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>

                                        {/* タイトル */}
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                mb: 2,
                                                color: '#1976d2',
                                                lineHeight: 1.3,
                                                minHeight: '3.6em',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {offer.title}
                                        </Typography>

                                        {/* 詳細情報 */}
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                                    👥 申込状況:
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {offer.applicants}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                                    📅 締め切り:
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {offer.deadline}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* アクションボタン */}
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button 
                                                variant="contained" 
                                                size="small"
                                                fullWidth
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 'bold',                                                background: 'linear-gradient(45deg, #424242 30%, #757575 90%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #212121 30%, #424242 90%)',
                                                    }
                                                }}
                                            >
                                                📋 詳細表示
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 'bold',
                                                    borderColor: '#1976d2',
                                                    color: '#1976d2',
                                                    '&:hover': {
                                                        borderColor: '#1565c0',
                                                        backgroundColor: '#e3f2fd',
                                                    }
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

                    {/* 新規作成ボタン */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 4,
                                py: 2,
                                borderRadius: 3,
                                fontSize: '1.2rem',
                                fontWeight: 'bold',                            background: 'linear-gradient(45deg, #757575 30%, #9e9e9e 90%)',
                                boxShadow: '0 3px 15px rgba(117, 117, 117, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #616161 30%, #757575 90%)',
                                    boxShadow: '0 5px 20px rgba(117, 117, 117, 0.4)',
                                }
                            }}
                        >
                            ➕ 新しいオファーを作成
                        </Button>
                    </Box>                </Container>
            </Box>
    );
}

export default Offer;