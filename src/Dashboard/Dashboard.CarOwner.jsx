import React from 'react';
import MainLayout from '../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../GarageSideBar';

const styles = {
  p: 2,
  m: 0.5,
  border: '0px solid',
  borderRadius: 3,
  fontSize: '1.25rem',
  fontWeight: '700',
  backgroundColor: '#000',
  opacity: [1, 1, 1]
};

function CarOwner () {
  return (
    <MainLayout>
      <Box sx={styles} gridColumn="span 2">
        <GarageSideBar />
      </Box>
      <Box sx={styles} gridColumn="span 8">Your garage is empty</Box>
    </MainLayout>
  );
}

export default CarOwner;
