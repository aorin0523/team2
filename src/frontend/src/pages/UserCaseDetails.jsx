import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// アイコン
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// 画像
import business_man from '../img/business_man.png';
// css
import '../App.css'
import '../css/UserCaseDetails.css'

function App() {
    const ratingValue = 3;

return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          <div className='header-left'>
            <a href='/'>
                <h3>ぱいざ</h3>
            </a>
        </div>
        </Typography>

        {<div className='header-right'>
            <ul>
                <li><a href='/'>仕事を探す</a></li>
                <li><a href='/'>仕事の内容</a></li>
                <li>
                    <IconButton sx={{ color : "white"}} size="small" >
                        <BookmarkIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton sx={{ color : "white"}} size="small" >
                        <NotificationsIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton sx={{ color : "white"}} size="small" >
                        <MailIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton sx={{ color : "white"}} size="small" >
                        <HelpOutlineIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton sx={{ color : "white"}} size="small" >
                        <AccountCircleIcon />
                    </IconButton>
                </li>
            </ul>
        </div>}
    </Toolbar>
    </AppBar>

    <Toolbar />
    <Box component="main" className="container" sx={{ flexGrow: 1 }}>
                <div class='client'>
                    <img src={business_man}/>
                    <p>羽伊座太郎</p>
                    <Typography component="legend"></Typography>
                    <Rating name="read-only" value={ratingValue} readOnly />
                    <p>募集件数：23</p>
                    <p>契約件数：17</p>
                    <p>契約完了件数：9</p>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#4fc3f7',
                            color : "white",
                            borderRadius: "30px",
                            '&:focus': {
                                outline: 'none',
                            }
                            }}>質問する</Button>
                </div>
                <div class='work-outline'>
                    <h2>テストウェブサイトのコーディング</h2>
                    <p>添付された資料を基にテストウェブを完成させてください。<br/>【 応募時のお願い 】
<br/>・自己紹介や実績
<br/>・依頼してから納品までの流れ、所要時間
<br/>こちらを記載していただけると助かります。
<br/>
<br/>【重視するポイント】
<br/>スピード、柔軟な対応ができる方
<br/>出来れば急ぎでほしいので、即納できますという方がいましたら大変ありがたいです。
<br/>良くしていただいた際は今後何かあった時にまたご依頼したいと考えています。
<br/>
<br/>一定数の応募があった場合、締切前に打ち切る可能性がありますのでご了承ください。
<br/>
<br/>その他ご質問等ありましたら、気軽にお問い合わせください。
<br/>よろしくお願いいたします。</p>
                    <Button
                        variant="contained"
                        sx={{
                            width: "80%",
                            backgroundColor: '#4fc3f7',
                            color : "white",
                            borderRadius: "30px",
                            '&:focus': {
                                outline: 'none',
                            }
                            }}>応募する</Button>
                    </div>
            </Box>
        </Box>
    )
}

export default App
