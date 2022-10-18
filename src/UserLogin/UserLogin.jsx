import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { Box, Button, Divider, Fade, FormControl, Stack, TextField, Typography, Link } from '@mui/material';
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
  const handleSubmit = () => {
    setLoginMessage(null);
    authenticationService.login(username, password)
      .then(({ isLoggedIn, status }) => {
        if (isLoggedIn) {
          navigate('/');
        } else {
          setLoginMessage(status === '500'
            ? 'Oops! Something goes wrong with network connection or the online service.'
            : 'Login failed. Please make sure username and password is correct');
        }
      });
  };
  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <MainLayout>
      <Box gridColumn="span 2" />
      <Box className="App-container" gridColumn="span 6">
        <h2>User Login</h2>

        <Stack m="auto" alignItems="center" className="App-sub-container">
          <FormControl fullWidth={true}>
            <Stack alignItems="center">
              <TextField
                margin='dense'
                id="username"
                label="Username"
                autoComplete="username"
                value={username}
                onChange={changeUsername}
                onKeyPress={handleEnterKeyPress}
                required
              />
              <TextField
                margin='dense'
                id="user-password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={changePassword}
                onKeyPress={handleEnterKeyPress}
                required
              />

              { loginMessage
                ? <Fade appear={true} in={true} timeout={1000}>
                  <Typography className="warning-text" textAlign="center">{loginMessage}</Typography>
                </Fade>
                : <Typography className="warning-text" /> // placeholder
              }
            </Stack>
            <Divider sx={{ mb: '28px' }}/>
          </FormControl>
          <Button onClick={handleSubmit} variant="contained" type="submit">Submit</Button>
          &nbsp;
          <Typography>Not have a user account? <Link href="/sign-up">SignUp</Link> here</Typography>
        </Stack>

      </Box>
    </MainLayout>
  );
}

export default UserLogin;
