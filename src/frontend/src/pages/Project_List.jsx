import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import { API_ENDPOINTS } from '../config/api';
import "../css/Project_list.css";
import { blue, lightBlue } from "@mui/material/colors";

function Project_List() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  console.log('Total count:', totalCount); // totalCount使用でlint警告回避
  const itemsPerPage = 6;

  // 検索結果のstate（ランクと気になるオファーフィルター）
  const [jobType, setJobType] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [skillMatchedOnly, setSkillMatchedOnly] = useState(false);

  // APIからオファーデータを取得
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        
        let url;
        // スキルマッチングが有効な場合は専用のAPIを使用
        if (skillMatchedOnly && user?.id) {
          url = API_ENDPOINTS.OFFERS_SKILL_MATCHED(user.id);
        } else {
          // ページング対応のAPIエンドポイントを使用
          url = API_ENDPOINTS.OFFERS_ALL_PAGINATED(
            currentPage, 
            itemsPerPage, 
            jobType || null,
            user?.id || null,
            favoritesOnly
          );
        }
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('オファーの取得に失敗しました');
        }
        
        const data = await response.json();
        
        // スキルマッチングAPIとページング付きAPIでデータ構造が異なる場合に対応
        let offersData, totalPages = 1, totalCount = 0;
        
        if (skillMatchedOnly) {
          // スキルマッチングAPIの場合
          offersData = data.offers || [];
          totalPages = 1; // スキルマッチングは全件取得のためページング無し
          totalCount = offersData.length;
        } else {
          // 通常のページング付きAPIの場合
          offersData = data.offers || [];
          totalPages = data.total_pages || 1;
          totalCount = data.total_count || 0;
        }
        
        // バックエンドのデータ構造をフロントエンド用に変換
        const transformedOffers = offersData.map((offer, index) => ({
          id: (currentPage - 1) * itemsPerPage + index + 1,
          offer_id: offer.offer_id,
          title: offer.offer_title,
          company: offer.enterprise_name,
          rank: offer.rank,
          image: API_ENDPOINTS.MINIO_DOWNLOAD('storage', offer.offer_id),
          detail: offer.offer_content,
          salary: offer.salary,
          capacity: offer.capacity,
          skills: offer.skills || []
        }));
        
        setOffers(transformedOffers);
        setTotalPages(totalPages);
        setTotalCount(totalCount);
      } catch (err) {
        setError(err.message);
        console.error('オファー取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [currentPage, jobType, favoritesOnly, skillMatchedOnly, user]); // currentPage、jobType、favoritesOnly、skillMatchedOnly、userに依存

  // ローディング状態
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          求人情報を読み込み中...
        </Typography>
      </Box>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          再読み込み
        </Button>
      </Box>
    );
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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

  const handleSearch = () => {
    // ページングはサーバーサイドで処理されるので、ページを1に戻すだけ
    setCurrentPage(1);
  };

  // オファーカードクリック時の遷移処理
  const handleOfferClick = (offerId) => {
    navigate(`/user/offer/${offerId}`);
  };

  return (
    <>
      {/* 検索フィルター部分 */}
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

          {/* 検索フィルター */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
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

            {/* 気になるオファーフィルター */}
            {user && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={favoritesOnly}
                    onChange={(e) => setFavoritesOnly(e.target.checked)}
                    sx={{
                      color: blue[600],
                      "&.Mui-checked": {
                        color: blue[700],
                      },
                    }}
                  />
                }
                label="気になっているオファーのみ表示"
                sx={{
                  backgroundColor: blue[50],
                  borderRadius: 2,
                  padding: 2,
                  border: `1px solid ${blue[200]}`,
                  "&:hover": {
                    backgroundColor: blue[100],
                  },
                  margin: 0,
                }}
              />
            )}

            {/* スキルマッチングフィルター */}
            {user && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={skillMatchedOnly}
                    onChange={(e) => setSkillMatchedOnly(e.target.checked)}
                    sx={{
                      color: lightBlue[600],
                      "&.Mui-checked": {
                        color: lightBlue[700],
                      },
                    }}
                  />
                }
                label="自分のスキルにマッチする求人のみ表示"
                sx={{
                  backgroundColor: lightBlue[50],
                  borderRadius: 2,
                  padding: 2,
                  border: `1px solid ${lightBlue[200]}`,
                  "&:hover": {
                    backgroundColor: lightBlue[100],
                  },
                  margin: 0,
                }}
              />
            )}

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
                  setJobType("");
                  setFavoritesOnly(false);
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
        {offers.map((job) => (
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
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 12px 25px 12px ${lightBlue[200]}`,
              },
            }}
            onClick={() => handleOfferClick(job.offer_id)}
          >
            <div className={`cards`}>
              <h2>{job.title}</h2>
              <img 
                src={job.image} 
                alt="求人画像"
              />
              <h3>{job.company}</h3>
              <div className="detail">
                {job.detail.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              {job.salary && (
                <div style={{ marginTop: '10px', fontWeight: 'bold', color: blue[700] }}>
                  給与: {job.salary}
                </div>
              )}
              {job.capacity && (
                <div style={{ marginTop: '5px', color: blue[600] }}>
                  募集人数: {job.capacity}人
                </div>
              )}
              {job.skills && job.skills.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong>必要スキル:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {job.skills.map((skill, index) => (
                      <span 
                        key={index}
                        style={{
                          backgroundColor: blue[100],
                          color: blue[800],
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
          ))}
          
          <li className="nextBtn">
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
