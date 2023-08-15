import React, { useEffect, useState } from 'react';
import { Avatar, Button, CircularProgress, Fade, IconButton, Stack, Typography } from '@mui/material';
import * as C from '../../../App.constants';
import { ValidationErrors } from '../model/ValidationErrors';
import { contentService } from '../../../service';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { updateAvatar, submitAvatarUpdate, setStatus, UserProfileState } from '../../../store/tokenUserSlice';
import { AppDispatch, RootState } from '../../../store';

const initValidationErrors:ValidationErrors = { hasUpdate: false }

function AvatarUploadForm () {
  const tokenUser = useAppSelector((state:RootState) => state.tokenUser );
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newAvatar, setNewAvatar] = useState(new Blob());
  const [errors, setErrors] = useState(initValidationErrors);

  const dispatch = useAppDispatch();
  const avatarId = tokenUser.userProfile.attributes?.avatar[0];
  useEffect(() => {
    if (avatarId && avatarId.length > 0) setAvatarUrl(`${C.CONTENT_THUMBNAIL_API}/${avatarId}?size=medium`);
  }, [avatarId]);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      setAvatarUrl(URL.createObjectURL(files[0]));
      setNewAvatar(files[0]);
      setErrors((prevErrors) => {
        const { hasUpdate, ...rest } = prevErrors;
        return rest;
      });
    }
  }

  const handleSubmit = async () => {
    if (tokenUser.status === C.LOADING) { return; }
    else { dispatch(setStatus(C.LOADING)); }
    // step 1: upload content and return new content id
    const {status, data} = await contentService.upload(newAvatar, "public");
    // step 2: update avatar id by the new content id
    dispatch(setStatus(C.IDLE));

    if (status === 202 && data) {
      const newAvatarId = data.uuid;
      dispatch(updateAvatarAction(newAvatarId));
    } else {
      setErrors(prevState => ({ ...prevState, hasUpdate: false, avatar: "Oops! Something goes wrong"}))
    }
  }

  const updateAvatarAction = (newAvatarId:string) => {
    return (dispatch:AppDispatch) => {
      dispatch(updateAvatar(newAvatarId));
      const updatedTokenUser:UserProfileState = { ...tokenUser, userProfile: { attributes: { avatar: [newAvatarId]}} };
      dispatch(submitAvatarUpdate(updatedTokenUser)).then(
        () => {
          setErrors(initValidationErrors);
        }
      );
    }
  }

  const isValidForm = Object.values(errors).length === 0 && (tokenUser.status !== C.LOADING);

  return (
    <Stack className="user-avatar-upload" alignItems="center">
      <label htmlFor="avatar-picture-chooser">
        <IconButton aria-label="upload picture" component="span">
          <Avatar alt={tokenUser.userProfile.username} src={ avatarUrl }/>
          {tokenUser.status === C.LOADING && (
            <CircularProgress sx={{ position: 'absolute' }}/>
          )}
        </IconButton>
      </label>
      { !errors.avatar ?
        <Fade appear={true} in={true} timeout={1000}>
          <Typography variant="body2">Click to choose new picture</Typography>
        </Fade>
        :
        <Fade appear={true} in={true} timeout={1000}>
          <Typography variant="body2" color="primary">{errors.avatar}</Typography>
        </Fade>
      }
      <Button
        disabled={!isValidForm}
        onClick={handleSubmit}
        type="submit"
        variant="contained"
      >
        Upload
      </Button>
      <input hidden={true} accept="image/*" id="avatar-picture-chooser" type="file" onChange={handleChange}/>
    </Stack>
  )
}

export default AvatarUploadForm;
