import React, { useState } from "react";
import {
  IconButton,
  Box,
  Button,
  AppBar,
  Link,
  Toolbar,
  FormControl,
  InputLabel,  Select,
  MenuItem,
} from "@mui/material";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";
import NotificationsSharpIcon from "@mui/icons-material/NotificationsSharp";
import EmailSharpIcon from "@mui/icons-material/EmailSharp";
import HelpSharpIcon from "@mui/icons-material/HelpSharp";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import { API_ENDPOINTS } from '../config/api';
import "../css/Project_list.css";
import { blue, lightBlue } from "@mui/material/colors";

function Project_List() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const jobs = [
    {
      id: 1,
      title: "【未経験歓迎】人材マッチング×Webアプリ開発／Java・React",
      company: "パーソナルキャリア株式会社",
      area: "kantou",
      prefecture: "東京",
      rank: "A",
      tech: "システムエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card1_img.jpg'),
      detail:
        "求人マッチングシステム開発\n使用技術：Java / Spring Boot / React / AWS / Kubernetes\n特徴：大規模求人データを活用した開発。DX推進プロジェクトあり",
    },
    {
      id: 2,
      title: "【充実研修あり】製造系ERPシステム開発／.NET×Oracle×PL/SQL",
      company: "株式会社アウトソーシングテクノロジー",
      area: "kantou",
      prefecture: "東京",
      rank: "B",
      tech: "WEBエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card2.webp'),
      detail:
        "製造業向けERPシステム開発\n使用技術：C# / .NET / Oracle / PL/SQL\n特徴：研修制度あり。未経験者も安心。勤務地は首都圏中心",
    },
    {
      id: 3,
      title: "【教育DX】スタディサプリ開発チームで自社開発に挑戦／React・Java",
      company: "株式会社ベネッセホールディングス",
      area: "hokuriku",
      prefecture: "石川",
      rank: "C",
      tech: "ネットワークエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card3.jpg'),
      detail:
        "教育系Webアプリ開発\n使用技術：React / Java / AWS\n特徴：教育業界の大手。自社開発あり。リモート可",
    },
    {
      id: 4,
      title: "【リモート可】AWS専門企業でクラウド開発に挑戦／インフラも学べる",
      company: "株式会社サーバーワークス",
      area: "hokkaido",
      prefecture: "北海道",
      rank: "A",
      tech: "システムエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card4.jpg'),
      detail:
        "AWSクラウドインフラ支援・Webアプリ開発\n使用技術：AWS / Python / Node.js\n特徴：AWS専門。クラウド環境の設計・構築に携われる",
    },
    {
      id: 5,
      title: "【PM候補】大手コンサル直請け案件／DX推進プロジェクトで成長できる",
      company: "きらぼしコンサルティング",
      area: "hokkaido",
      prefecture: "北海道",
      rank: "D",
      tech: "システムエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card5.png'),
      detail:
        "DX推進支援プロジェクト\n使用技術：要件定義 / PM支援 / クラウド設計\n特徴：コンサル×エンジニアリング。PM志望者にもおすすめ",
    },
    {
      id: 6,
      title: "【柔軟な働き方】リクルート系社内システム開発／実務経験者優遇",
      company: "株式会社リクルートスタッフィング",
      area: "hokkaido",
      prefecture: "北海道",
      rank: "S",
      tech: "システムエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card6.jpg'),
      detail:
        "社内業務システムの開発支援\n使用技術：Java / SQL / JavaScript\n特徴：大手グループ案件。残業少なめ。働きやすい環境",
    },
    {
      id: 7,
      title: "【Flutter活用】モバイルアプリ開発／toCサービスでスキルアップ",
      company: "株式会社アンドパッド",
      area: "hokuriku",
      prefecture: "石川",
      rank: "B",
      tech: "セキュリティエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card7.jpg'),
      detail:
        "建設業向けモバイルアプリ開発\n使用技術：Flutter / Firebase / Dart / REST API\n特徴：ユーザー向けアプリ開発。UI/UX設計に携われる",
    },
    {
      id: 8,
      title: "【Python活用】AIチャットボット開発／自然言語処理に挑戦",
      company: "株式会社エクサウィザーズ",
      area: "tyuugoku",
      prefecture: "広島",
      rank: "C",
      tech: "アプリケーションエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card8.png'),
      detail:
        "AIチャットボットの設計・開発\n使用技術：Python / FastAPI / GCP / NLP\n特徴：AI開発に関われる。社会課題解決型プロジェクト",
    },
    {
      id: 9,
      title: "【Go言語】フィンテック領域でマイクロサービス開発／モダンな環境",
      company: "株式会社FOLIO",
      area: "kyuusyuu",
      prefecture: "大分",
      rank: "A",
      tech: "クラウドエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card9.jpg'),
      detail:
        "投資系Webサービスの開発\n使用技術：Go / GraphQL / Docker / Kubernetes\n特徴：マイクロサービスアーキテクチャ。少数精鋭チーム",
    },
    {
      id: 10,
      title: "【UX重視】大手旅行予約サイトのUI刷新プロジェクト／Next.js導入",
      company: "株式会社エイチ・アイ・エス",
      area: "kinki",
      prefecture: "大阪",
      rank: "C",
      tech: "データベースエンジニア",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card10.jpg'),
      detail:
        "Webサイトのフロントエンドリニューアル\n使用技術：Next.js / TypeScript / Figma\n特徴：デザインと連携したUI開発。パフォーマンス改善",
    },
    {
      id: 11,
      title: "【ゲーム好き歓迎】Unityでスマホゲーム開発／ヒットタイトル多数",
      company: "株式会社コロプラ",
      area: "hokuriku",
      prefecture: "新潟",
      rank: "B",
      tech: "プロダクトマネージャー",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card11.png'),
      detail:
        "スマートフォン向けゲーム開発\n使用技術：Unity / C# / Git / Jenkins\n特徴：自社ゲーム開発。企画にも関われる環境",
    },
    {
      id: 12,
      title:
        "【安定基盤×挑戦】官公庁向け業務システム刷新プロジェクト／Java中心",
      company: "日本電気株式会社（NEC）",
      area: "kantou",
      prefecture: "神奈川",
      rank: "B",
      tech: "システムコンサルタント",
      image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', 'card12.jpg'),
      detail:
        "官公庁向け業務アプリの再構築\n使用技術：Java / Oracle / Spring Framework\n特徴：社会インフラを支える安定案件。長期プロジェクト",
    },
  ];

  const totalPages = Math.ceil(
    (results.length > 0 ? results.length : jobs.length) / itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  const jobsToDisplay = results.length > 0 ? results : jobs;

  const displayedJobs = jobsToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 検索結果のconst
  const [area, setArea] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [jobType, setJobType] = useState("");
  const [tech, setTech] = useState("");

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      return (
        (!area || job.area === area) &&
        (!prefecture || job.prefecture === prefecture) &&
        (!jobType || job.rank === jobType) &&
        (!tech || job.tech === tech)
      );
    });
    setResults(filtered);
    setCurrentPage(1);
  };

  const prefectureOptions = {
    hokkaido: ["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島"],
    kantou: ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"],
    hokuriku: ["新潟", "富山", "石川", "福井", "山梨", "長野"],
    toukai: ["静岡", "愛知", "岐阜", "三重"],
    kinki: ["大阪", "兵庫", "京都", "滋賀", "奈良", "和歌山"],
    tyuugoku: [
      "鳥取",
      "島根",
      "岡山",
      "広島",
      "山口",
      "徳島",
      "香川",
      "愛媛",
      "高知",
    ],
    kyuusyuu: [
      "福岡",
      "佐賀",
      "長崎",
      "熊本",
      "大分",
      "宮崎",
      "鹿児島",
      "沖縄",
    ],  };
  return (
    <>
      {/* 検索フィルター部分を改善 */}
      <Box
        className="search-container"
        sx={{
          mt: 4,
          px: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minWidth: 320,
            maxWidth: 400,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <h2 style={{ margin: 0, color: blue[800], fontSize: "1.4rem" }}>
              求人検索
            </h2>
            <p
              style={{
                margin: "8px 0 0 0",
                color: blue[600],
                fontSize: "0.9rem",
              }}
            >
              条件を選択して検索してください
            </p>
          </Box>

          {/* 検索フィルター - 縦に配置 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <FormControl fullWidth>
              <InputLabel sx={{ color: blue[700] }}>地域</InputLabel>
              <Select
                value={area}
                label="地域"
                onChange={(e) => {
                  setArea(e.target.value);
                  setPrefecture("");
                }}
                sx={{
                  backgroundColor: blue[50],
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[200],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[600],
                  },
                }}
              >
                <MenuItem value="">全ての地域</MenuItem>
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
              <FormControl fullWidth>
                <InputLabel sx={{ color: blue[700] }}>都道府県</InputLabel>
                <Select
                  value={prefecture}
                  label="都道府県"
                  onChange={(e) => setPrefecture(e.target.value)}
                  sx={{
                    backgroundColor: blue[50],
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: blue[200],
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: blue[400],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: blue[600],
                    },
                  }}
                >
                  <MenuItem value="">全ての都道府県</MenuItem>
                  {prefectureOptions[area].map((pref) => (
                    <MenuItem key={pref} value={pref}>
                      {pref}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel sx={{ color: blue[700] }}>ランク</InputLabel>
              <Select
                value={jobType}
                label="ランク"
                onChange={(e) => setJobType(e.target.value)}
                sx={{
                  backgroundColor: blue[50],
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[200],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[600],
                  },
                }}
              >
                <MenuItem value="">全てのランク</MenuItem>
                <MenuItem value="S">S (最高レベル)</MenuItem>
                <MenuItem value="A">A (上級レベル)</MenuItem>
                <MenuItem value="B">B (中級レベル)</MenuItem>
                <MenuItem value="C">C (初級レベル)</MenuItem>
                <MenuItem value="D">D (入門レベル)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: blue[700] }}>職種</InputLabel>
              <Select
                value={tech}
                label="職種"
                onChange={(e) => setTech(e.target.value)}
                sx={{
                  backgroundColor: blue[50],
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[200],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[400],
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: blue[600],
                  },
                }}
              >
                <MenuItem value="">全ての職種</MenuItem>
                <MenuItem value="システムエンジニア">システムエンジニア</MenuItem>
                <MenuItem value="WEBエンジニア">WEBエンジニア</MenuItem>
                <MenuItem value="アプリケーションエンジニア">
                  アプリケーションエンジニア
                </MenuItem>
                <MenuItem value="ネットワークエンジニア">
                  ネットワークエンジニア
                </MenuItem>
                <MenuItem value="データベースエンジニア">
                  データベースエンジニア
                </MenuItem>
                <MenuItem value="セキュリティエンジニア">
                  セキュリティエンジニア
                </MenuItem>
                <MenuItem value="クラウドエンジニア">クラウドエンジニア</MenuItem>
                <MenuItem value="プロダクトマネージャー">
                  プロダクトマネージャー
                </MenuItem>
                <MenuItem value="プロジェクトマネージャー">
                  プロジェクトマネージャー
                </MenuItem>
                <MenuItem value="システムコンサルタント">
                  システムコンサルタント
                </MenuItem>
              </Select>
            </FormControl>

            {/* 検索ボタンとリセットボタン */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
                sx={{
                  backgroundColor: blue[600],
                  color: "white",
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    backgroundColor: blue[700],
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                🔍 検索
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setArea("");
                  setPrefecture("");
                  setJobType("");
                  setTech("");
                  setResults([]);
                  setCurrentPage(1);
                }}
                sx={{
                  color: blue[600],
                  borderColor: blue[300],
                  py: 1.5,
                  borderRadius: 2,
                  minWidth: "100px",
                  "&:hover": {
                    borderColor: blue[600],
                    backgroundColor: blue[50],
                  },
                }}
              >
                リセット
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <div className="card">
        {displayedJobs.map((job) => (
          <Box
            key={job.id}
            sx={{
              border: `1px solid ${lightBlue[200]}`,
              boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
              borderRadius: 2,
              padding: 2,
              backgroundColor: "white",
              maxWidth: 400,
              margin: "20px auto",
            }}
          >
            <div className={`card${job.id}`}>
              <h2>{job.title}</h2>
              <img src={job.image} alt="求人画像" />
              <h3>{job.company}</h3>
              <div className="detail">
                {job.detail.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          </Box>
        ))}
      </div>

      <nav className="pagination">
        <ul className="pagination-ui">
          <li className="previousBtn">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              startIcon={<ArrowBackSharpIcon />}
            >
              {" "}
              Previous
            </Button>
          </li>

          {getVisiblePages().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <div className="page-dots">...</div>
              ) : (
                <Button
                  className={`page${page} ${
                    page === currentPage ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )}
            </li>
          ))}          <li className="nextBtn">
            <Button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Project_List;
