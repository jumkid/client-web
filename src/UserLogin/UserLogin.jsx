import React, { useState } from 'react';
import MainLayout from '../layout/MainLayout';
import { Box, Button, Divider, FormControl, Stack, TextField } from '@mui/material';
import '../App.css';
import authenticationService from '../service/AuthenticationService';
import { Navigate } from 'react-router-dom';

function UserLogin () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleUserLogin = () => {
    console.log(`user login ${username} ${password}`);
    authenticationService.login(username, password)
      .then(() => {
        return (<Navigate to={{ pathname: '/' }}/>);
      });
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
                InputProps={{ style: { fontSize: 20 } }}
                InputLabelProps={{ style: { fontSize: 20 } }}
                required/>
            </Stack>
            <Divider sx={{ my: '28px' }}/>
          </FormControl>
          <Button onClick={handleUserLogin} variant="contained">Submit</Button>
        </Stack>

      </Box>
    </MainLayout>
  );
}

export default UserLogin;
