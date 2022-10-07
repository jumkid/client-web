import React from 'react';
import MainLayout from './layout/MainLayout';
import { Box, Divider } from '@mui/material';

function NotFound () {
  return (
    <MainLayout>
      <Box display="flex" flex={1}>Oops! This page is not available yet</Box>
      <Divider />
    </MainLayout>
  );
}

export default NotFound;
