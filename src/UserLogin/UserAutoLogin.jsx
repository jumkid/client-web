import React, { useEffect, useState } from 'react';
import { Box, Fade, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import MainLayout from '../layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import authenticationService from '../service/AuthenticationService';

function UserAutoLogin ({ username, password }) {
  const [message, setMessage] = useState('Please wait');
  const navigate = useNavigate();

  const handleAutoLogin = (username, password) => {
    authenticationService.login(username, password)
      .then((isLoggedIn) => {
        if (isLoggedIn) {
          setTimeout(() => { navigate('/'); }, 2000);
        } else {
          setMessage('Login failed. Something goes wrong.');
        }
      });
  };

  useEffect(() => {
    handleAutoLogin(username, password);
  }, []);

  return (
    <MainLayout>
      <Box gridColumn="span 2" />
      <Box className="App-container" gridColumn="span 6">
        <h2>User Login</h2>

        <Stack m="auto" alignItems="center">
          <Fade in={true}>
            <Paper className="auto-login">
              <LinearProgress />
              <Typography>{message}</Typography>
            </Paper>
          </Fade>
        </Stack>

      </Box>
    </MainLayout>
  );
}

UserAutoLogin.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

export default UserAutoLogin;
