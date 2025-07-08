import { useState } from 'react';

import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';


import '../css/offerdetail.css'

function App() {
  const [count, setCount] = useState(0);
  const drawerWidth = 248;


  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {['Home', '募集フォーム', 'オファー一覧'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 3 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        {/* 詳細ページメインエリアに表示される部分 */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 ,justifyContent: 'space-between',}}>
          <Toolbar />
          <Typography variant="h3" gutterBottom>
            企業詳細ページ
          </Typography>
          <Card sx={{ 
                  mr:"auto",
                  ml:3,
                  mb: 5,                
                  boxShadow: 3,         
                  border: '2px solid #2196f3', 
                  p: 4,                 
                  width: '1200px',        
                        
                  mx: 'auto'  
                    }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                つながる技術、広がる可能性。未経験OKの開発インターン！
              </Typography>
              <Grid container direction="column" spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: 700,
                    mx: 'auto',
                    py: 1, 
                    borderBottom: '1px solid #ccc' ,
                    mt: 6
                    }}>
                    <Typography variant="body1">申し込み状況：</Typography>
                    <Typography variant="body1"><strong>2人 / 8人</strong></Typography>
                  </Box>
                </Grid>

                
                <Grid item xs={12}>
                  <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: 700,
                      mx: 'auto',
                      py: 1, 
                      borderBottom: '1px solid #ccc' 
                      }}>
                    <Typography variant="body1">募集締め切り：</Typography>
                    <Typography variant="body1"><strong>7月9日</strong></Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: 700,
                      mx: 'auto',
                      py: 1, 
                      borderBottom: '1px solid #ccc' 
                      }}>
                    <Typography variant="body1">設定ランク：</Typography>
                    <Typography variant="body1"><strong>C</strong></Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ maxWidth: 700, mx: 'auto', mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  仕事内容
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 ,textAlign: 'left'}}>
                  サンプルテキストです。ここにはインターン内容や企業の紹介を自由に記述できます。
                  例えば、Reactでの開発経験を積めるチャンス、チーム開発、週1〜の柔軟勤務など……
                </Typography>
                <Divider sx={{ borderColor: '#ccc' }} />
              </Box>


              
            </CardContent>
          </Card>
            <Button variant="outlined" sx={{ mb: 2 }}>
              ← 戻る
            </Button>

        </Box>
      </Box>
    </>
  );
}

export default App;