import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Fade,
  FormControl,
  LinearProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { ValidationErrors } from '../model/ValidationErrors';
import { UserProfile } from '../model/UserProfile';
import authenticationManager from '../../Auth/AuthenticationManager';
import * as C from '../../../App.constants';
import Validator from '../UserProfile.Validator';
import authenticationService from '../../../service/AuthenticationService';

const tokenUser = authenticationManager.getTokenUser()!;
const initUserProfile:UserProfile = {
  username: '',
  email: '',
  emailVerified: false,
  firstName: '',
  lastName: '',
  enabled: true,
  credentials: [
    { type: 'password', value: '' }
  ],
  password: '',
  confirmPassword: '',
  attributes: {
    avatar: []
  }
};

const initValidationErrors:ValidationErrors = { hasUpdate: false }

function UserProfileMainPanel () {
  const [userProfile, setUserProfile] = useState(initUserProfile);
  const [errors, setErrors] = useState(initValidationErrors);

  const [isSubmitted, setIsSubmitted] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');

  const validator = new Validator(userProfile, errors);
  const tokenUserId = tokenUser.sub;

  useEffect(() => {
    console.log("fetch user profile");
    authenticationService.getUser(tokenUserId)
      .then(({isSuccess, data}) => {
        if (isSuccess) {
          setUserProfile(() => ({...data}));
          setIsSubmitted(false);
        }
      })
  },[tokenUserId]);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    const { value, name } = event.target;
    setErrors((prevErrors) => {
      const { hasUpdate, ...rest } = prevErrors;
      return rest;
    });
    setUserProfile(() => ({
      ...userProfile,
      [name]: value
    }));
  };

  const handleBlur = (event:React.FocusEvent<HTMLInputElement>):void => {
    const { value, name } = event.target;
    const _errors = validator.validate(value, name);
    setErrors(() => ({
      ..._errors
    }));
  };

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isValidForm) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setSubmitMessage('');

    authenticationService.updateUser(tokenUserId, userProfile)
      .then(({ isSuccess, data }) => {
        setIsSubmitted(false);
        if (!isSuccess) {
          setIsSubmitted(false);
          setSubmitMessage('Something goes wrong. Save failed.');
          if (data && /\busername\b/i.test(data.errorMessage)) {
            setErrors((errors) => ({ ...errors, username: 'username is not available' }));
          } else if (data && /\bemail\b/i.test(data.errorMessage)) {
            setErrors((errors) => ({ ...errors, email: 'email is not available' }));
          }
        } else {
          setSubmitMessage("Save successfully");
        }
      })
  }

  const handlePasswordReset = () => {
    setIsSubmitted(true);
    setSubmitMessage('');

  }

  const isValidForm = Object.values(errors).length === 0;

  return (
    <MainLayout mode="light" menuIndex={-1}>
      <Box />
      <Box className="App-container" gridColumn="span 8" minWidth="1024px">
        <h2>User Profile</h2>

        <Stack m="auto" alignItems="left" className="App-sub-container">
          { submitMessage
            ? <Fade appear={true} in={true} timeout={1000}>
              <Typography className="warning-text" textAlign="center">{submitMessage}</Typography>
            </Fade>
            : <Typography className="warning-text"/>
          }

          <div>
            <FormControl>
              <TextField
                disabled
                margin='dense'
                name="username"
                label="Username"
                value={userProfile.username}
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                disabled
                margin='dense'
                name="email"
                label="Email"
                autoComplete="email"
                value={userProfile.email}
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                required
                margin='dense'
                name="firstName"
                label="First Name"
                value={userProfile.firstName}
                onChange={handleChange}
                onKeyPress={handleEnterKeyPress}
                onBlur={handleBlur}
                variant="outlined"
              />
              <TextField
                required
                margin='dense'
                name="lastName"
                label="Last Name"
                value={userProfile.lastName}
                onChange={handleChange}
                onKeyPress={handleEnterKeyPress}
                onBlur={handleBlur}
                variant="outlined"
              />
              <div>
                <Button
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                  disabled={!isValidForm}
                  type="submit"
                  variant="contained">
                  Save
                </Button>
              </div>
            </FormControl>

            <FormControl sx={{ ml: 3, width: '50vh', top: 50 }}>
              <Stack alignItems="center">
                <Box>
                  <Avatar
                    alt={tokenUser.preferred_username}
                    src={`${C.CONTENT_THUMBNAIL_API}${tokenUser.avatarId}?size=medium`}
                    sx={{ border: 2, width: 168, height: 168 }}
                  />
                </Box>
              </Stack>
            </FormControl>
          </div>

          <br/><Divider/><br/>

          <FormControl sx={{ '& .MuiTextField-root': { mr: 1 } }} fullWidth={true}>
            <Box><small>Password Reset</small></Box>
            <div>
              <TextField
                required
                margin='dense'
                name="password"
                label="New Password"
                type="password"
                onChange={handleChange}
                onKeyPress={handleEnterKeyPress}
                onBlur={handleBlur}
                variant="outlined"
                sx={{ float: 'left' }}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                required
                margin='dense'
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                onChange={handleChange}
                onKeyPress={handleEnterKeyPress}
                onBlur={handleBlur}
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Button
                sx={{ mt: 3, ml: 5 }}
                onClick={handlePasswordReset}
                disabled={!isValidForm}
                type="submit"
                variant="contained">
                Reset
              </Button>
            </div>
          </FormControl>
          <br/>
          { isSubmitted && <Fade appear={true} in={true} easing='2000'><LinearProgress /></Fade> }
        </Stack>
      </Box>
    </MainLayout>
  )
}

export default UserProfileMainPanel;
