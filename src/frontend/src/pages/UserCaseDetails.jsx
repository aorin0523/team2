import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

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
    <>
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
      <body>
            <div class='container'>
                <div class='client'>
                    <img src={business_man}/>
                    <p>クライアント名</p>
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
                    <h2>仕事概要</h2>
                    <p>仕事内容</p>
                </div>
            </div>
      </body>
    </>
  )
}

export default App
