import React from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Box, Divider, Stack } from '@mui/material';
import PasswordResetForm from './PasswordResetForm';
import UserProfileUpdateForm from './UserProfileUpdateForm';
import './index.css';

function UserProfileMainPanel () {
  return (
    <MainLayout mode="dark" menuIndex={-1}>
      <Box gridColumn="span 2"/>

      <Stack className="main-panel" alignItems="center" gridColumn="span 6">
        <Box className="main-container">
          <h2>User Profile</h2>

          <UserProfileUpdateForm/>

          <Box my={2}><Divider/></Box>

          <PasswordResetForm/>
        </Box>
      </Stack>
    </MainLayout>
  )
}

export default UserProfileMainPanel;
