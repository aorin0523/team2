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
import { blue , lightBlue } from '@mui/material/colors';
import '../css/Jobs.css';
import { useState } from 'react';

function Jobs() {
  const [area, setArea] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [jobType, setJobType] = useState('');
  const [tech, setTech] = useState('');

  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const filtered = jobList.filter((job) => {
      return (
        (!area || job.area === area) &&
        (!prefecture || job.prefecture === prefecture) &&
        (!jobType || job.rank === jobType.replace('rank', '')) &&
        (!tech || job.tech === tech)
      );
    });
    setResults(filtered);
  };

  const prefectureOptions = {
    hokkaido: ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'],
    kantou: ['東京', '神奈川', '千葉', '埼玉', '茨城', '栃木', '群馬'],
    hokuriku: ['新潟', '富山', '石川', '福井', '山梨', '長野'],
    toukai: ['静岡', '愛知', '岐阜', '三重'],
    kinki: ['大阪', '兵庫', '京都', '滋賀', '奈良', '和歌山'],
    tyuugoku: ['鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知'],
    kyuusyuu: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄']
  };

  const jobList = [
  { id: 1, company: 'パーソナルキャリア株式会社', area: 'kantou', prefecture: '東京', rank: 'A', tech: 'システムエンジニア', 
    detail: '求人マッチングシステム開発使用技術：Java / Spring Boot / React / AWS / Kubernetes特徴：大規模求人データを活用した開発。DX推進プロジェクトあり'},
  { id: 2, company: '株式会社アウトソーシングテクノロジー', area: 'kantou', prefecture: '東京', rank: 'B', tech: 'WEBエンジニア', detail: '製造業向けERPシステム開発使用技術：C# / .NET / Oracle / PL/SQL特徴：研修制度あり。未経験者も安心。 勤務地は首都圏中心' },
  { id: 3, company: '株式会社ベネッセホールディングス', area: 'hokuriku', prefecture: '石川', rank: 'C', tech: 'ネットワークエンジニア', detail: '教育系Webアプリ開発使用技術：React / Java / AWS 特徴：教育業界の大手。自社開発あり。リモート可' },
  { id: 4, company: '株式会社サーバーワークス', area: 'hokkaido', prefecture: '北海道', rank: 'A', tech: 'システムエンジニア', detail: '詳細情報2' },
  { id: 5, company: 'きらぼしコンサルティング', area: 'hokkaido', prefecture: '北海道', rank: 'D', tech: 'システムエンジニア', detail: '詳細情報2' },
  { id: 6, company: '株式会社リクルートスタッフィング', area: 'hokkaido', prefecture: '北海道', rank: 'S', tech: 'システムエンジニア', detail: '詳細情報2' }
  
  ];

  return (
    <>
      <Box component="header" className="header" sx={{ backgroundColor: blue[700] , '&:hover': {backgroundColor: blue[600]}}}>
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

      {/* ▼ 三列＋検索ボタン */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, px: 3,  justifyContent: 'center', ml: 18 }}>
        <FormControl sx={{ minWidth: 120 , backgroundColor: blue[50]}}>
          <InputLabel>地域</InputLabel>
          <Select
            value={area}
            label="地域"
            onChange={(e) => {
              setArea(e.target.value);
              setPrefecture(''); 
            }}
          >
            <MenuItem value="hokkaido">北海道・東北</MenuItem>
            <MenuItem value="kantou">関東</MenuItem>
            <MenuItem value="hokuriku">北陸・甲信越</MenuItem>
            <MenuItem value="toukai">東海</MenuItem>
            <MenuItem value="kinki">近畿</MenuItem>
            <MenuItem value="tyuugoku">中国・四国</MenuItem>
            <MenuItem value="kyuusyuu">九州・沖縄</MenuItem>
          </Select>
        </FormControl>

        {area && (
          <FormControl sx={{ minWidth: 120 , backgroundColor: blue[50] }}>
            <InputLabel>都道府県</InputLabel>
            <Select
              value={prefecture}
              label="都道府県"
              onChange={(e) => setPrefecture(e.target.value)}
            >
              {prefectureOptions[area].map((pref) => (
                <MenuItem key={pref} value={pref}>
                  {pref}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl sx={{ minWidth: 120 , backgroundColor: blue[50] }}>
          <InputLabel>ランク</InputLabel>
          <Select value={jobType} label="ランク" onChange={(e) => setJobType(e.target.value)}>
            <MenuItem value="rankS">S</MenuItem>
            <MenuItem value="rankA">A</MenuItem>
            <MenuItem value="rankB">B</MenuItem>
            <MenuItem value="rankC">C</MenuItem>
            <MenuItem value="rankD">D</MenuItem>
            <MenuItem value="rankE">E</MenuItem>
            <MenuItem value="rankF">F</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 , backgroundColor: blue[50] }}>
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

        <Button className="search" variant="contained"   onClick={handleSearch} sx={{ backgroundColor: blue[300] , '&:hover': {backgroundColor: blue[200]} }}>
          検索
        </Button>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {results.length === 0 && <Box>該当する案件はありません</Box>}
        {results.map((job) => (
          <Box
            key={job.id}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              backgroundColor: '#f9f9f9',
              whiteSpace: 'pre-line',
            }}
          >
            <div>会社名：{job.company}</div>
            <div>地域：{job.prefecture}　ランク：{job.rank}　職種：{job.tech}</div>
            <div>詳細：{job.detail}</div>
          </Box>
        ))}
      </Box>
    </Box>

    <Box sx={{ boxShadow: `0px 4px 12px ${lightBlue[100]}`, 
        padding: 2,
        borderRadius: 8,}}>
      <div className='result'>
        <p>検索結果</p>
      </div>
    </Box>
    </>
  );
}

export default Jobs
