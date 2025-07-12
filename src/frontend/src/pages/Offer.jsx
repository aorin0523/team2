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
    ListItemText,
    AppBar,
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
        }
    ];

    const sidebarItems = [
        { text: "Home", icon: "🏠" },
        { text: "募集フォーム作成", icon: "📝" },
        { text: "オファーページ", icon: "👥" },
        { text: "設定", icon: "⚙️" }
    ];



    const getRankColor = (rank) => {
        switch (rank) {
            case 'A': return 'error';
            case 'B': return 'warning';
            case 'C': return 'info';
            default: return 'default';
        }
    };



    return (
            <main className="main-content">
                {/* ページタイトル */}
                <div className="offer-header">
                    <h1>オファーページ</h1>
                </div>

                {/* オファーカード一覧 */}
                <div className="offer-container">
                    <div className="offer-plans">

                        {offers.map((offer) => (
                            <Box
                                key={offer.id}
                                className={`offer-card ${selectedOffer === offer.id ? 'selected' : ''}`}
                                onClick={() => setSelectedOffer(offer.id)}
                            >
                                <Box className="offer-content">
                                    {/* 左側：タイトルと詳細情報 */}
                                    <Box className="offer-info">
                                        <Box className="offer-title">
                                            {offer.title}
                                        </Box>

                                        <Box className="offer-details">
                                            <p className="detail-item">申込状況：{offer.applicants}</p>
                                            <p className="detail-item">締め切り：{offer.deadline}</p>
                                        </Box>

                                        <Box className="rank-section">
                                            <span className="rank-label">Rank:</span>
                                            <Chip
                                                label={offer.rank}
                                                color={getRankColor(offer.rank)}
                                                size="medium"
                                                className="rank-chip"
                                            />
                                        </Box>
                                    </Box>

                                    {/* 右側：詳細ボタン */}
                                    <Box className="offer-actions">
                                        <Button className="detail-button" variant="outlined">
                                            詳細
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </div>
                </div>
            </main>
    );
}

export default Offer;