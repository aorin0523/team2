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
    <Box component="header" className="header">
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

      {/* ▼ 三列＋検索ボタン */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>エリア</InputLabel>
          <Select value={area} label="エリア" onChange={(e) => setArea(e.target.value)}>
            <MenuItem value=""><em>選択</em></MenuItem>
            <MenuItem value="tokyo">東京</MenuItem>
            <MenuItem value="osaka">大阪</MenuItem>
            <MenuItem value="nagoya">名古屋</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>職種</InputLabel>
          <Select value={jobType} label="職種" onChange={(e) => setJobType(e.target.value)}>
            <MenuItem value=""><em>選択</em></MenuItem>
            <MenuItem value="engineer">エンジニア</MenuItem>
            <MenuItem value="designer">デザイナー</MenuItem>
            <MenuItem value="pm">PM</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>技術</InputLabel>
          <Select value={tech} label="技術" onChange={(e) => setTech(e.target.value)}>
            <MenuItem value=""><em>選択</em></MenuItem>
            <MenuItem value="react">React</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="aws">AWS</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" sx={{ bgcolor: blue[500] }}>
          検索
        </Button>
      </Box>
    </Box>
  );
}

export default Jobs;
