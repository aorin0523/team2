import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid
} from '@mui/material';
import Side from '../components/Side';
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
        // 登録処理をここに実装
        console.log('フォームデータ:', formData);
    };

    return (
        <Box className="profile-layout">
            <Side />
            <Box className="profile-main">
                <Box className="profile-container">
                    <Box className="profile-header">
                        <Typography variant="h4" className="profile-title">
                            企業側プロフィール
                        </Typography>
                    </Box>

                    <Paper elevation={1} className="profile-paper">
                        <form onSubmit={handleSubmit}>
                            {/* 会社情報 */}
                            <Box className="profile-section">
                                <Typography variant="h6" className="section-title">
                                    会社情報
                                </Typography>

                                <Box className="field-row">
                                    <Typography className="field-label">会社名</Typography>
                                    <TextField
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>

                                <Box className="field-row">
                                    <Typography className="field-label">会社名（フリガナ）</Typography>
                                    <TextField
                                        name="companyNameKana"
                                        value={formData.companyNameKana}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>

                                <Box className="field-row">
                                    <Typography className="field-label">所在地</Typography>
                                    <TextField
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>
                            </Box>

                            {/* 担当者情報 */}
                            <Box className="profile-section">
                                <Typography variant="h6" className="section-title">
                                    担当者情報
                                </Typography>

                                <Box className="field-row">
                                    <Typography className="field-label">担当者</Typography>
                                    <TextField
                                        name="manager"
                                        value={formData.manager}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>

                                <Box className="field-row">
                                    <Typography className="field-label">担当者役職</Typography>
                                    <TextField
                                        name="managerPosition"
                                        value={formData.managerPosition}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>

                                <Box className="field-row">
                                    <Typography className="field-label">担当者メールアドレス</Typography>
                                    <TextField
                                        name="managerEmail"
                                        type="email"
                                        value={formData.managerEmail}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>
                            </Box>

                            {/* ログイン情報 */}
                            <Box className="profile-section">
                                <Typography variant="h6" className="section-title">
                                    ログイン情報
                                </Typography>

                                <Box className="field-row">
                                    <Typography className="field-label">ログイン用メールアドレス</Typography>
                                    <TextField
                                        name="loginEmail"
                                        type="email"
                                        value={formData.loginEmail}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>

                                <Box className="field-row">
                                    <Typography className="field-label">パスワード</Typography>
                                    <TextField
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        variant="outlined"
                                        className="profile-textfield"
                                    />
                                </Box>
                            </Box>

                            {/* 登録ボタン */}
                            <Box className="profile-button-container">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    className="profile-submit-button"
                                >
                                    登録する
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Profile;