import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { Box, Button, Divider, Fade, FormControl, Stack, TextField, Typography } from '@mui/material';
import '../App.css';
import authenticationService from '../service/AuthenticationService';

function UserLogin () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleUserLogin = () => {
    setLoginMessage(null);
    authenticationService.login(username, password)
      .then((isLoggedIn) => {
        setLoginMessage(isLoggedIn
          ? null
          : 'Login failed. Please make sure username and password is correct');
        if (isLoggedIn) navigate('/');
      });
  };
  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleUserLogin();
    }
  };

  return (
    <MainLayout>
      <Box gridColumn="span 2" />
      <Box className="App-container" gridColumn="span 6">
        <h2>User Login</h2>

        <Stack m="auto" alignItems="center" className="App-sub-container">
          <FormControl fullWidth>
            <Stack alignItems="center">
              <TextField
                margin='dense'
                id="username"
                label="Username"
                autoComplete="username"
                value={username}
                onChange={changeUsername}
                onKeyPress={handleEnterKeyPress}
                InputProps={{ style: { fontSize: 20 } }}
                InputLabelProps={{ style: { fontSize: 20 } }}
                required />
              <TextField
                margin='dense'
                id="user-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={changePassword}
                onKeyPress={handleEnterKeyPress}
                InputProps={{ style: { fontSize: 20 } }}
                InputLabelProps={{ style: { fontSize: 20 } }}
                required/>

              { loginMessage
                ? <Fade appear={true} in={true} timeout={1000}>
                  <Typography className="warning-text" textAlign="center">{loginMessage}</Typography>
                </Fade>
                : <Typography className="warning-text" /> // placeholder
              }
            </Stack>
            <Divider sx={{ mb: '28px' }}/>
          </FormControl>
          <Button onClick={handleUserLogin} variant="contained">Submit</Button>
        </Stack>

      </Box>
    </MainLayout>
  );
}

export default UserLogin;
