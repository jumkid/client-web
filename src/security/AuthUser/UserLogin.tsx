import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Fade, FormControl, Stack, TextField, Typography, Link } from '@mui/material';
import authenticationService from '../../service/AuthenticationService';
import SimpleLayout from '../../layout/SimpleLayout';

const initialLoginMessage:string | null = null;

function UserLogin () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(initialLoginMessage);

  const changeUsername = (event:React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const changePassword = (event:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    setLoginMessage(null);
    authenticationService.login(username, password)
      .then(({ isSuccess, status }) => {
        if (isSuccess) {
          navigate('/');
        }
      }).catch(({ isSuccess, status }) => {
        setLoginMessage(status === 500
          ? 'Oops! Something goes wrong with network connection or the online service.'
          : 'Login failed. Please make sure username and password is correct');
      });
  };

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <SimpleLayout>
      <Box className="App-container">
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

              <Typography className="warning-text" textAlign="center">{loginMessage}</Typography>
            </Stack>
            <Divider sx={{ mb: '28px' }}/>
          </FormControl>
          <Button onClick={handleSubmit} variant="contained" type="submit">Submit</Button>
          &nbsp;
          <Typography>Not have a user account? <Link href="/sign-up">SignUp</Link> here</Typography>
        </Stack>

      </Box>
    </SimpleLayout>
  );
}

export default UserLogin;
