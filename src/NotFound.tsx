import React from 'react';
import SimpleLayout from './layout/SimpleLayout';
import { Box, Divider } from '@mui/material';

function NotFound () {
  return (
    <SimpleLayout>
      <Box display="flex" flex={1}>Oops! This page is not available yet</Box>
      <Divider />
    </SimpleLayout>
  );
}

export default NotFound;
