import React, { useState } from 'react'
import { Button, FormControl, TextField } from '@mui/material';
import Validator from '../UserProfile.Validator';
import { ValidationErrors } from '../model/ValidationErrors';
import UserAvatarUploadForm from './UserAvatarUploadForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAppDispatch } from '../../../App.hooks';
import { submitUserProfile, updateUserProfile } from '../../../store/tokenUserSlice';

const initValidationErrors:ValidationErrors = { hasUpdate: false }

function UserProfileUpdateForm () {
  const tokenUser = useSelector((state:RootState) => state.tokenUser);
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

  const handleEnterKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isValidForm) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) { return; }
    else{
      setIsSubmitted(true);
    }

    dispatch(submitUserProfile(tokenUser)).then(
      (success) => {
        setIsSubmitted(false);
        setErrors(initValidationErrors);
      },
      (error) => {
        setIsSubmitted(false);
        setErrors(error);
      }
    );
  };

  const isValidForm = Object.values(errors).length === 0;

  return (
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

      <UserAvatarUploadForm/>
    </div>
  )
}

export default UserProfileUpdateForm;
