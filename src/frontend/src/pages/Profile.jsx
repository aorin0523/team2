import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid
} from '@mui/material';
import '../css/profile.css';

const Profile = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        companyNameKana: '',
        location: '',
        manager: '',
        managerPosition: '',
        managerEmail: '',
        loginEmail: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('フォームデータ:', formData);
    };

    return (
        <Box className="profile-main">
            <Box className="profile-container">
                <Box className="profile-header">
                    <Typography variant="h4" className="profile-title">
                        ユーザープロフィール
                    </Typography>
                </Box>
                
                <Paper elevation={6} className="profile-paper" sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #fafafa 0%, #e0e0e0 100%)' }}>
                    <form onSubmit={handleSubmit}>
                        {/* 会社情報 */}
                        <Box className="profile-section" sx={{ mb: 4 }}>
                            <Typography variant="h5" className="section-title" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                                🏢 会社情報
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            📊 会社名
                                        </Typography>
                                        <TextField
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="株式会社○○"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            📝 会社名（カナ）
                                        </Typography>
                                        <TextField
                                            name="companyNameKana"
                                            value={formData.companyNameKana}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="カブシキガイシャ○○"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            📍 所在地
                                        </Typography>
                                        <TextField
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="東京都○○区○○"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* 担当者情報 */}
                        <Box className="profile-section" sx={{ mb: 4 }}>
                            <Typography variant="h5" className="section-title" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                                👤 担当者情報
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            🙋‍♂️ 担当者名
                                        </Typography>
                                        <TextField
                                            name="manager"
                                            value={formData.manager}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="山田 太郎"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            💼 役職
                                        </Typography>
                                        <TextField
                                            name="managerPosition"
                                            value={formData.managerPosition}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="人事部長"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            📧 担当者メールアドレス
                                        </Typography>
                                        <TextField
                                            name="managerEmail"
                                            value={formData.managerEmail}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="yamada@company.com"
                                            type="email"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* ログイン情報 */}
                        <Box className="profile-section" sx={{ mb: 4 }}>
                            <Typography variant="h5" className="section-title" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 3 }}>
                                🔐 ログイン情報
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            📨 ログイン用メールアドレス
                                        </Typography>
                                        <TextField
                                            name="loginEmail"
                                            value={formData.loginEmail}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="login@company.com"
                                            type="email"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" className="form-label">
                                            🔒 パスワード
                                        </Typography>
                                        <TextField
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="パスワードを入力"
                                            type="password"
                                            className="form-input"
                                            sx={{ 
                                                borderRadius: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* 保存ボタン */}
                        <Box className="form-actions" sx={{ textAlign: 'center', pt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 6,
                                    py: 2,
                                    borderRadius: 3,
                                    fontSize: '1.1rem',
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
                                💾 プロフィールを保存
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default Profile;