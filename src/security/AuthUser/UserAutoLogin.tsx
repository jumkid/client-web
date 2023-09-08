import React, { useEffect, useState } from 'react';
import { Box, Fade, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import authenticationManager from '../Auth/AuthenticationManager';
import SimpleLayout from '../../layout/SimpleLayout';

type Props = {
  username?: string
  password?: string
}

function UserAutoLogin ({ username, password }: Props) {
  const [message, setMessage] = useState('Please wait');
  const navigate = useNavigate();

  const handleAutoLogin = (username?: string, password?: string) => {
    authenticationManager.login(username, password)
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
    <SimpleLayout>
      <Box className="App-container">
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
    </SimpleLayout>
  );
}

UserAutoLogin.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
};

export default UserAutoLogin;
