import {
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import HelpSharpIcon from '@mui/icons-material/HelpSharp';
import { blue } from '@mui/material/colors';
import '../css/Jobs.css';
import { useState } from 'react';

function Jobs() {
  const [area, setArea] = useState('');
  const [jobType, setJobType] = useState('');
  const [tech, setTech] = useState('');

  return (
    <>
    <Box component="header" className="header" sx={{  backgroundColor: blue[700]}}>
      <div className="logo">
        <h2 className="appname">ぱいざ</h2>
      </div>

      <div className="link">
        <nav className="nav-link">
          <a href="/" style={{ color: 'white' }}>仕事を探す</a>
          <a href="/" style={{ color: 'white' }}>仕事の管理</a>
          <IconButton sx={{ color: 'white' }}><BookmarkSharpIcon /></IconButton>
          <IconButton sx={{ color: 'white' }}><NotificationsSharpIcon /></IconButton>
          <IconButton sx={{ color: 'white' }}><EmailSharpIcon /></IconButton>
          <IconButton sx={{ color: 'white' }}><HelpSharpIcon /></IconButton>
          <IconButton sx={{ color: 'white' }}><AccountCircleSharpIcon /></IconButton>
        </nav>
      </div>
    </Box>

    {/* ▼ 三列＋検索ボタン  */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 3}}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>地域</InputLabel>
          <Select value={area} label="地域" onChange={(e) => setArea(e.target.value)}>
            <MenuItem value="hokkaido">北海道・東北</MenuItem>
            <MenuItem value="kantou">関東</MenuItem>
            <MenuItem value="hokuriku">北陸・甲信越</MenuItem>
            <MenuItem value="toukai">東海</MenuItem>
            <MenuItem value="kinki">近畿</MenuItem>
            <MenuItem value="tyuugoku">中国・四国</MenuItem>
            <MenuItem value="kyuusyuu">九州・沖縄</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>ランク</InputLabel>
          <Select value={jobType} label="ランク" onChange={(e) => setJobType(e.target.value)}>
            <MenuItem value="rankS">S</MenuItem>
            <MenuItem value="rankA">A</MenuItem>
            <MenuItem value="rankB">B</MenuItem>
            <MenuItem value="rankC">C</MenuItem>
            <MenuItem value="rankD">D</MenuItem>
            <MenuItem value="rankE">E</MenuItem>

          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>職種</InputLabel>
          <Select value={tech} label="職種" onChange={(e) => setTech(e.target.value)}>
            <MenuItem value="system">システムエンジニア</MenuItem>
            <MenuItem value="web">WEBエンジニア</MenuItem>
            <MenuItem value="app">アプリケーションエンジニア</MenuItem>
            <MenuItem value="network">ネットワークエンジニア</MenuItem>
            <MenuItem value="db">データベースエンジニア</MenuItem>
            <MenuItem value="security">セキュリティエンジニア</MenuItem>
            <MenuItem value="cloud">クラウドエンジニア</MenuItem>
            <MenuItem value="ProductManager">プロダクトマネージャー</MenuItem>
            <MenuItem value="pm">プロジェクトマネージャー</MenuItem>
            <MenuItem value="SystemConsultant">システムコンサルタント</MenuItem>
          </Select>
        </FormControl>

        <Button className="search" variant="contained" sx={{ bgcolor: blue[300] }}>
          検索
        </Button>
    </Box>
    </>
  );
}

export default Jobs;
