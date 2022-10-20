import React from 'react';
import { Box } from '@mui/material';
import MainLayout from '../../layout/MainLayout';

function Professional () {
  return (
    <MainLayout menuIndex={1}>
      <Box sx={{ height: '100%', maxHeight: '1024px' }} className="dashboard-box" gridColumn="span 2">

      </Box>
      <Box className="dashboard-box" gridColumn="span 8">
        Some cool thing is coming up ...
      </Box>
    </MainLayout>
  );
}

export default Professional;
