import Icon from '@mui/material/Icon';
import '../App.css'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '../css/UserCaseDetails.css'

function App() {

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
                <div class='page-transition'>
                    <a href='/'></a>
                    <IconButton sx={{ color : "black"}} size="small" >
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </div>
            </div>
      </body>
    </>
  )
}

export default App
