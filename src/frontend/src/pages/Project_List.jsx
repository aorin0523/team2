import React  from 'react'
import { IconButton } from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import EmailSharpIcon from '@mui/icons-material/EmailSharp';
import HelpSharpIcon from '@mui/icons-material/HelpSharp';
import card1 from "../images/card1_img.jpg";
import card2 from "../images/card2.webp";
import card3 from "../images/card3.jpg";
import card4 from "../images/card4.jpg";
import card5 from "../images/card5.png";
import card6 from "../images/card6.jpg";
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import '../css/Project_list.css';
import {blue} from '@mui/material/colors';
import {lightBlue} from '@mui/material/colors';
import { Box } from '@mui/material';


function Project_List() {
    return (
    <>
        <Box
        component="header"
        className="header"
        sx={{
            backgroundColor: blue[700],
            width: '100%',
            padding: '0 40px',
        }}>
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

        <div className='card'>
            <Box
            sx={{
            border: `1px solid ${lightBlue[200]}`,
            boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto'
            }}>
            <div className="card1">
            <h2>【未経験歓迎】<br />人材マッチング×Webアプリ開発／Java・React</h2>
            <img src={card1} alt="求人画像"></img>
            <h2>パーソナルキャリア株式会社</h2>
            <p className="detail">
                求人マッチングシステム開発<br />
                使用技術：Java / Spring Boot / React / <br />AWS / Kubernetes<br />
                特徴：大規模求人データを活用した開<br />発。DX推進プロジェクトあり
            </p>
            </div>
            </Box>

        <Box
            sx={{
            border: `1px solid ${lightBlue[200]}`,
            boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto'
            }}>
            <div className='card2'>
                <h2>【充実研修あり】<br />製造系ERPシステム開発／.NET×Oracle×PL/SQL</h2>
                <img src={card2}></img>
                <h2>株式会社アウトソーシングテクノロジー</h2>
                <p className='detail'>
                    製造業向けERPシステム開発<br />                                   
                    使用技術：C# / .NET / Oracle / PL/SQL <br />                    
                    特徴：研修制度あり。未経験者も安心。<br />  
                    勤務地は首都圏中心  
                </p>
            </div>
        </Box>
        
        <Box
            sx={{
            border: `1px solid ${lightBlue[200]}`,
            boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto'
            }}>
            <div className='card3'>
                <h2>【教育DX】<br />スタディサプリ開発チームで自社開発に挑戦／React・Java</h2>
                <img src={card3}></img>
                <h2>株式会社ベネッセホールディングス</h2>
                <p className='detail'>
                    教育系Webアプリ開発<br />
                    使用技術：React / Java / AWS <br />                             
                    特徴：教育業界の大手。自社開発あり。リモート可 <br /> 
                </p>
            </div>
        </Box>
        
        <Box
            sx={{
            border: `1px solid ${lightBlue[200]}`,
            boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto'
            }}>
            <div className='card4'>
                <h2>【リモート可】<br />AWS専門企業でクラウド開発に挑戦／インフラも学べる</h2>
                <img src={card4}></img>
                <h2>株式会社サーバーワークス</h2>
                <p className='detail'>
                    AWSクラウドインフラ支援・Webアプリ開発<br />
                    使用技術：AWS / Python / Node.js<br />                         
                    特徴：AWS専門。クラウド環境の設計・構築に携われる 
                </p>
            </div>
        </Box>
        
        <Box
            sx={{
            border: `1px solid ${lightBlue[200]}`,
            boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto'
            }}>
            <div className='card5'>
                <h2>【PM候補】<br />大手コンサル直請け案件／DX推進プロジェクトで成長できる</h2>
                <img src={card5}></img>
                <h2>きらぼしコンサルティング</h2>
                <p className='detail'>
                   DX推進支援プロジェクト <br />                                    
                   使用技術：要件定義 / PM支援 / クラウド設計 <br />               
                   特徴：コンサル×エンジニアリング。PM志望者にもおすすめ
                </p>
            </div>
        </Box>
        
        <Box
            sx={{
            border: `1px solid ${lightBlue[200]}`,
            boxShadow: `0 8px 19px 8px ${lightBlue[100]}`,
            borderRadius: 2,
            padding: 2,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto'
            }}>
            <div className='card6'>
                <h2>【柔軟な働き方】<br />リクルート系社内システム開発／実務経験者優遇</h2>
                <img src={card6}></img>
                <h2>株式会社リクルートスタッフィング</h2>
                <p className='detail'>
                    社内業務システムの開発支援 <br />                                
                    使用技術：Java / SQL / JavaScript<br />                       
                    特徴：大手グループ案件。残業少なめ。働きやすい環境
                </p>
            </div>
        </Box>
        </div>

        <nav className='pagenation'>
            <ul class="pagenation-ui">
                <li className='previousBtn'><button><IconButton><ArrowBackSharpIcon /></IconButton>Previous</button></li>
                <li><button className='page1' tabIndex="0" type="button" aria-label="Go to page 1">1</button></li>
                <li><button class="page2"  type="button" aria-label="Go to page 2">2</button></li>
                <li><button class="page3"  type="button" aria-label="Go to page 3">3</button></li>
                <li>
                <div class="page...">…</div>
                </li>
                <li><button class="page67" type="button" aria-label="Go to page 67">67</button></li>
                <li><button class="page68" type="button" aria-label="Go to page 68">68</button></li>
                <li className='previousBtn'><button>Next<IconButton><ArrowForwardSharpIcon /></IconButton></button></li>
            </ul>
        </nav>

    </>
    )
}

export default Project_List