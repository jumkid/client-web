import React, { useState } from 'react'
import { Box, Button, FormControl, Grid, TextField } from '@mui/material';
import Validator from '../UserProfile.Validator';
import { ValidationErrors } from '../model/ValidationErrors';
import AvatarUploadForm from './AvatarUploadForm';
import { RootState } from '../../../store';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { submitUserProfile, updateUserProfile } from '../../../store/tokenUserSlice';
import { Item } from '../../../layout/Layout.Theme';

const initValidationErrors:ValidationErrors = { hasUpdate: false }

function UserProfileUpdateForm () {
  const tokenUser = useAppSelector((state:RootState) => state.tokenUser);
  const userProfile = tokenUser.userProfile;

  const [errors, setErrors] = useState(initValidationErrors);
  const [isSubmitted, setIsSubmitted] = useState(false)

  const dispatch = useAppDispatch();

  const validator = new Validator(tokenUser.userProfile, errors);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    const { value, name } = event.target;
    setErrors((prevErrors) => {
      const { hasUpdate, ...rest } = prevErrors;
      return rest;
    });
    dispatch(updateUserProfile({ [name]: value }));
  };

  const handleBlur = (event:React.FocusEvent<HTMLInputElement>):void => {
    const { value, name } = event.target;
    const _errors = validator.validate(value, name);
    setErrors(() => ({
      ..._errors
    }));
  };

  const handleEnterKeyPress = async (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isValidForm) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      return;
    } else {
      setIsSubmitted(true);
    }

    try {
      await dispatch(submitUserProfile(tokenUser));
      setErrors(initValidationErrors);
    } catch (error) {
      setErrors({hasUpdate: true});
    } finally {
      setIsSubmitted(false);
    }
  };

  const isValidForm = Object.values(errors).length === 0;

  return (
    <Grid container spacing={1} columns={8}>
      <Grid item xs={4}>
        <FormControl>
          <Item>
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
          </Item>
          <Item>
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
          </Item>
          <Item>
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
          </Item>
          <Item>
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
          </Item>
        </FormControl>
        <Item>
          <Button
            onClick={handleSubmit}
            disabled={!isValidForm}
            type="submit"
            variant="contained">
            Save
          </Button>
        </Item>
      </Grid>

      <Grid item xs={4}>
        <AvatarUploadForm/>
      </Grid>
    </Grid>
  )
}

export default UserProfileUpdateForm;
