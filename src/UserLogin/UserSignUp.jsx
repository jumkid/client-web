import React, { useState } from 'react';
import {
  Box,
  Button, Checkbox,
  Divider,
  Fade,
  FormControl,
  FormControlLabel, LinearProgress,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import MainLayout from '../layout/MainLayout';
import authenticationService from '../service/AuthenticationService';
import Validator from './UserSignUp.Validator';
import UserAutoLogin from './UserAutoLogin';

const initUserProfile = {
  email: '',
  emailVerified: false,
  // requiredActions: ["VERIFY_EMAIL"],
  username: '',
  firstName: '',
  lastName: '',
  enabled: true,
  credentials: [
    { type: 'password', value: '' }
  ],
  confirmPassword: ''
};

function UserSignUp () {
  const [userProfile, setUserProfile] = useState(initUserProfile);

  const [errors, setErrors] = useState({ acceptedTerms: false });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState(null);
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setUserProfile(() => ({
      ...userProfile,
      [name]: value
    }));
  };

  const handleBlur = (event) => {
    const { name: fieldName } = event.target;
    const failedFields = new Validator(userProfile, fieldName);
    setErrors(() => ({
      ...errors,
      [fieldName]: Object.values(failedFields)[0]
    }));
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter' && isValidForm) {
      handleSubmit();
    }
  };

  const handleTermsAcceptance = (event) => {
    if (event.target.checked) {
      setErrors((errors) => {
        const { acceptedTerms, ...rest } = errors;
        return rest;
      });
    } else {
      setErrors((errors) => ({
        ...errors,
        acceptedTerms: false
      }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setSignUpMessage(null);

    // re-assemble data for backend usage
    const { password, confirmPassword, ...data } = userProfile;
    data.credentials[0].value = password;

    authenticationService.signUp(data)
      .then(({ isSuccess, data }) => {
        if (!isSuccess) {
          setIsSubmitted(false);
          setSignUpMessage('Something goes wrong. Sign Up failed.');
          if (data && /\busername\b/i.test(data.errorMessage)) {
            setErrors((errors) => ({ ...errors, username: 'username is not available' }));
          } else if (data && /\bemail\b/i.test(data.errorMessage)) {
            setErrors((errors) => ({ ...errors, email: 'email is not available' }));
          }
        } else {
          setIsAutoLogin(true);
        }
      });
  };

  const isValidForm = Object.values(errors).filter(error => typeof error !== 'undefined').length === 0;

  return (
    <>
      {isAutoLogin
        ? <UserAutoLogin username={userProfile.username} password={userProfile.confirmPassword} />
        : <MainLayout>
          <Box gridColumn="span 2" />
          <Box className="App-container" gridColumn="span 6">
            <h2>User Sign Up</h2>

            <Stack m="auto" alignItems="center" className="App-sub-container">
              <FormControl fullWidth>
                <Stack alignItems="center">
                  <TextField
                    margin='dense'
                    name="username"
                    label="Username"
                    autoComplete="username"
                    defaultValue={userProfile.username}
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    onBlur={handleBlur}
                    required
                    error={errors.username}
                    helperText={errors.username}
                  />
                  <TextField
                    margin='dense'
                    name="email"
                    label="Email"
                    autoComplete="email"
                    defaultValue={userProfile.email}
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    onBlur={handleBlur}
                    required
                    error={errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    margin='dense'
                    name="password"
                    label="Password"
                    type="password"
                    defaultValue={userProfile.credentials[0].value}
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    onBlur={handleBlur}
                    required
                    error={errors.password}
                    helperText={errors.password}
                  />
                  <TextField
                    margin='dense'
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    defaultValue={userProfile.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    onBlur={handleBlur}
                    required
                    error={errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />

                  <FormControlLabel
                    control={<Checkbox name="acceptedTerms" value="accepted" onChange={handleTermsAcceptance}/>}
                    label="Accept Terms & Conditions"
                  />

                  { signUpMessage
                    ? <Fade appear={true} in={true} timeout={1000}>
                      <Typography className="warning-text" textAlign="center">{signUpMessage}</Typography>
                    </Fade>
                    : <Typography className="warning-text" /> // placeholder
                  }
                </Stack>
                { isSubmitted && <LinearProgress /> }
                <Divider sx={{ mb: '28px' }}/>
              </FormControl>
              <Button onClick={handleSubmit} disabled={!isValidForm} type="submit" variant="contained">Submit</Button>
                &nbsp;
              <Typography>Already have a user account <Link href="/login">Login</Link> here</Typography>
            </Stack>

          </Box>
        </MainLayout>
      }
    </>
  );
}

export default UserSignUp;
