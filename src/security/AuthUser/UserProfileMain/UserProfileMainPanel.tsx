import React from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Box, Divider, Stack } from '@mui/material';
import UserPasswordResetForm from './UserPasswordResetForm';
import UserProfileUpdateForm from './UserProfileUpdateForm';

function UserProfileMainPanel () {
  return (
    <MainLayout mode="light" menuIndex={-1}>
      <Box/>
      <Box className="App-container" gridColumn="span 8" minWidth="1024px">
        <h2>User Profile</h2>

        <Stack m="auto" alignItems="left" className="App-sub-container">
          <UserProfileUpdateForm/>

          <br/><Divider/><br/>

          <UserPasswordResetForm/>
          <br/>
        </Stack>
      </Box>
    </MainLayout>
  )
}

export default UserProfileMainPanel;
