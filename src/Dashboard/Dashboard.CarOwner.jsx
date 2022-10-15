import React from 'react';
import MainLayout from '../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../GarageSideBar';
import './Dashboard.black.css';
import GarageMainPanel from '../GarageMainPanel';

function CarOwner () {
  return (
    <MainLayout>
      <Box className="dashboard-box" gridColumn="span 2">
        <GarageSideBar />
      </Box>
      <Box className="dashboard-box" gridColumn="span 8">
        <GarageMainPanel />
      </Box>
    </MainLayout>
  );
}

export default CarOwner;
