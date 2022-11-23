import React, { useState } from 'react';
import { Box, Button, FormControl, TextField } from '@mui/material';
import { ValidationErrors } from '../model/ValidationErrors';
import { UserProfile } from '../model/UserProfile';
import Validator from '../UserProfile.Validator';
import authenticationService from '../../../service/AuthenticationService';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../App.hooks';

const initUserProfile:UserProfile = {
  credentials: [
    { type: 'password', value: '' }
  ],
  password: '',
  confirmPassword: ''
}

const initValidationErrors:ValidationErrors = {
  password: '',
  confirmPassword: ''
}

export default function UserPasswordResetForm () {
  const tokenUser = useAppSelector((state:RootState) => state.tokenUser);
  const [userProfile, setUserProfile] = useState(initUserProfile);
  const [errors, setErrors] = useState(initValidationErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validator = new Validator(userProfile, errors);

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
    if (isSubmitted) return;
    else setIsSubmitted(true);

    authenticationService.resetPassword(tokenUser.userId, userProfile.password!)
      .then(({ isSuccess }) => {
        setIsSubmitted(true);
        if (isSuccess) {
          setUserProfile(initUserProfile);
          setErrors(initValidationErrors);
        }
      });
  }

  const isValidForm = Object.values(errors).length === 0;

  return (
    <FormControl sx={{ '& .MuiTextField-root': { mr: 1 } }} fullWidth={true}>
      <Box><small>Password Reset</small></Box>
      <div>
        <TextField
          required
          margin='dense'
          name="password"
          label="New Password"
          type="password"
          value={userProfile.password}
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
          value={userProfile.confirmPassword}
          onChange={handleChange}
          onKeyPress={handleEnterKeyPress}
          onBlur={handleBlur}
          variant="outlined"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <Button
          sx={{ ml: 2, mt: 3.5 }}
          onClick={handleSubmit}
          disabled={!isValidForm}
          type="submit"
          variant="contained">
          Reset
        </Button>
      </div>
    </FormControl>
  )
}
