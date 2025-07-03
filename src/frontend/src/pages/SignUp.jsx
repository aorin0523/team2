import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';

import { useState } from 'react';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // この２つの関数は、マウスのダウンとアップイベントを防止するために使用されます。
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [formUserId, setUserId] = useState('');
  const [formEmail, setEmail] = useState('');
  const [formPassword, setPassword] = useState('');

  const handleSubmit = () => {
      console.log('UserID:', formUserId);
      console.log('Email:', formEmail);
      console.log('Password:', formPassword);
  };

  return (
    <>
      <h1>Sign In</h1>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 4, border: '1px solid grey' }}>
        <div>
          <FormControl sx={{ mx: 1, my: 2, width: '25ch' }} variant="standard">
            <InputLabel htmlFor="user_id">UserID</InputLabel>
            <Input
              id="user_id"
              type='text'
              onChange={(e) => setUserId(e.target.value)}
            />
          </FormControl>

          <br />

          <FormControl sx={{ mx: 1, my: 2, width: '25ch' }} variant="standard">
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              type='email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <br />

          <FormControl sx={{ mx: 1, my: 2, width: '25ch' }} variant="standard">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </div>
      </Box>

      <Button
        variant="contained"
        sx={{ mx: 1, my: 2, width: '25ch' }}
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </>
  );
}