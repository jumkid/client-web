import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, Divider, FormControl, Stack, TextField, Typography, Link } from '@mui/material';
import authenticationManager from '../Auth/AuthenticationManager';
import SimpleLayout from '../../layout/SimpleLayout';
import * as _ from 'lodash';

function UserLogin () {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const changeUsername = (event:React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const changePassword = (event:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    setLoginMessage('');
    try {
      const response = await authenticationManager.login(username, password);
      if (response.isSuccess) {
        navigate('/');
      }
    } catch (error:any) {
      const warning = (error.status === 500)
        ? 'Oops! Something goes wrong with network connection or the online service.'
        : 'Login failed. Please make sure username and password is correct';
      setLoginMessage(warning);
    }
  };

  const handleEnterKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await handleSubmit();
    }
  };

  const isFormValid:boolean = useMemo(() => {
    return !_.isEmpty(username) && !_.isEmpty(password);
  }, [username, password]);

  return (
    <SimpleLayout>
      <Box className="App-container">
        <h2>User Login</h2>

        <Stack m="auto" alignItems="center" className="App-sub-container">
          <FormControl fullWidth={true}>
            <Stack alignItems="center">
              <TextField
                margin='dense'
                name="username"
                label="Username"
                autoComplete="username"
                value={username}
                onChange={changeUsername}
                onKeyPress={handleEnterKeyPress}
                required
              />
              <TextField
                margin='dense'
                inputProps={{
                  "data-testid": "password",
                }}
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
          <Button name="submit" onClick={handleSubmit} variant="contained" type="submit" disabled={!isFormValid}>Submit</Button>
          &nbsp;
          <Typography>Not have a user account? <Link href="/sign-up">SignUp</Link> here</Typography>
        </Stack>

      </Box>
    </SimpleLayout>
  );
}

export default UserLogin;
