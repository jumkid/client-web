import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { Box, Button, Divider, FormControl, Stack, TextField, Typography } from '@mui/material';
import '../App.css';
import authenticationService from '../service/AuthenticationService';

function UserLogin () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(' ');
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleUserLogin = () => {
    console.log(`user login ${username} ${password}`);
    authenticationService.login(username, password)
      .then((isLoggedIn) => {
        setLoginMessage(isLoggedIn
          ? ' '
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

              <Typography className="warning-text" textAlign="center">{loginMessage}</Typography>
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
