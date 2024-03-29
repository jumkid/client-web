import React from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../SideBar';
import MainPanel from '../MainPanels';

function MyVehiclesDashboard () {
  return (
    <MainLayout mode="dark" menuIndex={0}>
      <Box className="side-bar-panel" gridColumn="span 2">
        <GarageSideBar />
      </Box>

      <Box className="main-panel" gridColumn="span 8">
        <MainPanel />
      </Box>
    </MainLayout>
  );
}

export default MyVehiclesDashboard;
