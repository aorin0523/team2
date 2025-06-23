import React, { useState } from 'react';
import { IconButton, Box } from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import HelpSharpIcon from '@mui/icons-material/HelpSharp';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import card1 from "../images/card1_img.jpg";
import card2 from "../images/card2.webp";
import card3 from "../images/card3.jpg";
import card4 from "../images/card4.jpg";
import card5 from "../images/card5.png";
import card6 from "../images/card6.jpg";
import card7 from "../images/card7.jpg";
import card8 from "../images/card8.png";
import card9 from "../images/card9.jpg";
import card10 from "../images/card10.jpg";
import card11 from "../images/card11.png";
import card12 from "../images/card12.jpg";

import '../css/Project_list.css';
import { blue, lightBlue } from '@mui/material/colors';

function Project_List() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const jobs = [
    {
      id: 1,
      title: '【未経験歓迎】人材マッチング×Webアプリ開発／Java・React',
      company: 'パーソナルキャリア株式会社',
      image: card1,
      detail: '求人マッチングシステム開発\n使用技術：Java / Spring Boot / React / AWS / Kubernetes\n特徴：大規模求人データを活用した開発。DX推進プロジェクトあり'
    },
    {
      id: 2,
      title: '【充実研修あり】製造系ERPシステム開発／.NET×Oracle×PL/SQL',
      company: '株式会社アウトソーシングテクノロジー',
      image: card2,
      detail: '製造業向けERPシステム開発\n使用技術：C# / .NET / Oracle / PL/SQL\n特徴：研修制度あり。未経験者も安心。勤務地は首都圏中心'
    },
    {
      id: 3,
      title: '【教育DX】スタディサプリ開発チームで自社開発に挑戦／React・Java',
      company: '株式会社ベネッセホールディングス',
      image: card3,
      detail: '教育系Webアプリ開発\n使用技術：React / Java / AWS\n特徴：教育業界の大手。自社開発あり。リモート可'
    },
    {
      id: 4,
      title: '【リモート可】AWS専門企業でクラウド開発に挑戦／インフラも学べる',
      company: '株式会社サーバーワークス',
      image: card4,
      detail: 'AWSクラウドインフラ支援・Webアプリ開発\n使用技術：AWS / Python / Node.js\n特徴：AWS専門。クラウド環境の設計・構築に携われる'
    },
    {
      id: 5,
      title: '【PM候補】大手コンサル直請け案件／DX推進プロジェクトで成長できる',
      company: 'きらぼしコンサルティング',
      image: card5,
      detail: 'DX推進支援プロジェクト\n使用技術：要件定義 / PM支援 / クラウド設計\n特徴：コンサル×エンジニアリング。PM志望者にもおすすめ'
    },
    {
      id: 6,
      title: '【柔軟な働き方】リクルート系社内システム開発／実務経験者優遇',
      company: '株式会社リクルートスタッフィング',
      image: card6,
      detail: '社内業務システムの開発支援\n使用技術：Java / SQL / JavaScript\n特徴：大手グループ案件。残業少なめ。働きやすい環境'
    },

    {
      id: 7,
      title: '【Flutter活用】モバイルアプリ開発／toCサービスでスキルアップ',
      company: '株式会社アンドパッド',
      image: card7,
      detail: '建設業向けモバイルアプリ開発\n使用技術：Flutter / Firebase / Dart / REST API\n特徴：ユーザー向けアプリ開発。UI/UX設計に携われる'
    },
    {
      id: 8,
      title: '【Python活用】AIチャットボット開発／自然言語処理に挑戦',
      company: '株式会社エクサウィザーズ',
      image: card8,
      detail: 'AIチャットボットの設計・開発\n使用技術：Python / FastAPI / GCP / NLP\n特徴：AI開発に関われる。社会課題解決型プロジェクト'
    },
    {
      id: 9,
      title: '【Go言語】フィンテック領域でマイクロサービス開発／モダンな環境',
      company: '株式会社FOLIO',
      image: card9,
      detail: '投資系Webサービスの開発\n使用技術：Go / GraphQL / Docker / Kubernetes\n特徴：マイクロサービスアーキテクチャ。少数精鋭チーム'
    },
    {
      id: 10,
      title: '【UX重視】大手旅行予約サイトのUI刷新プロジェクト／Next.js導入',
      company: '株式会社エイチ・アイ・エス',
      image: card10,
      detail: 'Webサイトのフロントエンドリニューアル\n使用技術：Next.js / TypeScript / Figma\n特徴：デザインと連携したUI開発。パフォーマンス改善'
    },
    {
      id: 11,
      title: '【ゲーム好き歓迎】Unityでスマホゲーム開発／ヒットタイトル多数',
      company: '株式会社コロプラ',
      image: card11,
      detail: 'スマートフォン向けゲーム開発\n使用技術：Unity / C# / Git / Jenkins\n特徴：自社ゲーム開発。企画にも関われる環境'
    },
    {
      id: 12,
      title: '【安定基盤×挑戦】官公庁向け業務システム刷新プロジェクト／Java中心',
      company: '日本電気株式会社（NEC）',
      image: card12,
      detail: '官公庁向け業務アプリの再構築\n使用技術：Java / Oracle / Spring Framework\n特徴：社会インフラを支える安定案件。長期プロジェクト'
    }
  ];

  

  

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const displayedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Box component="header" className="header" sx={{ backgroundColor: blue[700], width: '100%' }}>
        <div className="logo"><h2 className="appname">ぱいざ</h2></div>
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

      <div className='card'>
        {displayedJobs.map(job => (
          <Box
            key={job.id}
            sx={{
              border: `1px solid ${lightBlue[200]}`,
              boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
              borderRadius: 2,
              padding: 2,
              backgroundColor: 'white',
              maxWidth: 400,
              margin: '20px auto'
            }}
          >
            <div className={`card${job.id}`}>
              <h2>{job.title}</h2>
              <img src={job.image} alt="求人画像" />
              <h2>{job.company}</h2>
              <p className="detail">
                {job.detail.split('\n').map((line, i) => <div key={i}>{line}</div>)}
              </p>
            </div>
          </Box>
        ))}
      </div>

      <nav className='pagenation'>
        <ul className="pagenation-ui">
          <li className='previousBtn'>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
              <IconButton><ArrowBackSharpIcon /></IconButton>Previous
            </button>
          </li>

          {getVisiblePages().map((page, index) => (
            <li key={index}>
              {page === '…' ? (
                <div className="page-dots">…</div>
              ) : (
                <button
                  className={`page${page} ${page === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li className='nextBtn'>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next<IconButton><ArrowForwardSharpIcon /></IconButton>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Project_List;
