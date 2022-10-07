import React from 'react';
import MainLayout from '../layout/MainLayout';
import { Box, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import '../App.css';

function UserLogin () {
  return (
    <MainLayout>
      <Box gridColumn="span 2" />
      <Box className="App-container" gridColumn="span 6">
        <h2>User Login</h2>

        <Box className="App-sub-container">
          <FormControl>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input id="username" aria-describedby="username-helper" />
            <FormHelperText id="username-helper">type your user id here</FormHelperText>
          </FormControl>
        </Box>

      </Box>
    </MainLayout>
  );
}

export default UserLogin;
