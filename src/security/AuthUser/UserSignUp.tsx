import React, { useState } from 'react';
import {
  Box,
  Button, Checkbox,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import authenticationService from '../../service/AuthenticationService';
import Validator from './UserProfile.Validator';
import UserAutoLogin from './UserAutoLogin';
import SimpleLayout from '../../layout/SimpleLayout/SimpleLayout';
import { UserProfile } from './model/UserProfile';
import { ValidationErrors } from './model/ValidationErrors';

const initUserProfile:UserProfile = {
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
  password: '',
  confirmPassword: '',
  phone: ''
};

const initValidationErrors:ValidationErrors = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
}

function UserSignUp () {
  const [userProfile, setUserProfile] = useState(initUserProfile);

  const [errors, setErrors] = useState(initValidationErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const validator = new Validator(userProfile, initValidationErrors);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    const { value, name } = event.target;
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

  const handleTermsAcceptance = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setErrors((errors:ValidationErrors) => {
        const { acceptedTerms, ...rest } = errors;
        return rest;
      });
    } else {
      setErrors((errors:ValidationErrors) => ({
        ...errors,
        acceptedTerms: false
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitted(true);
    setSignUpMessage('');

    const {isSuccess, data} = await authenticationService.signUp(userProfile);
    if (!isSuccess) {
      setIsSubmitted(false);
      setSignUpMessage('Something goes wrong. Sign Up failed.');
      if (data && /\busername\b/i.test(data.errorMessage)) {
        setErrors((errors) => ({...errors, username: 'username is not available'}));
      } else if (data && /\bemail\b/i.test(data.errorMessage)) {
        setErrors((errors) => ({...errors, email: 'email is not available'}));
      }
    } else {
      setIsAutoLogin(true);
    }
  };

  const isValidForm = Object.values(errors).filter(error => typeof error !== 'undefined').length === 0;

  return (
    <>
      {isAutoLogin
        ? <UserAutoLogin username={userProfile.username} password={userProfile.password} />
        : <SimpleLayout>
          <Box className="App-container">
            <h2>User Sign Up</h2>

            <Stack m="auto" alignItems="center" className="App-sub-container">
              <FormControl fullWidth={true}>
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
                    error={!!errors.username}
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
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    margin='dense'
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handleChange}
                    onKeyPress={handleEnterKeyPress}
                    onBlur={handleBlur}
                    required
                    error={!!errors.password}
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
                    error={!!errors.confirmPassword}
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

                <Divider/>

              </FormControl>
              <Button onClick={handleSubmit} disabled={!isValidForm} type="submit" variant="contained">Submit</Button>
                &nbsp;
              <Typography>Already have a user account <Link href="/login">Login</Link> here</Typography>
            </Stack>

          </Box>
        </SimpleLayout>
      }
    </>
  );
}

export default UserSignUp;
