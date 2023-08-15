import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../SideBar';
import MainPanel from '../MainPanels';
import { fetchUserVehicles } from '../../../store/userVehiclesSlice';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import * as C from '../../../App.constants';

function MyVehiclesDashboard () {
  const dispatch = useAppDispatch();
  const userVehiclesStatus = useAppSelector(state => state.userVehicles.status);

  useEffect(() => {
    if (userVehiclesStatus === C.IDLE) {
      const pagingSearch = { keyword: '*', page: 1, size: C.DEFAULT_PAGE_SIZE }
      dispatch(fetchUserVehicles(pagingSearch));
    }
  }, [dispatch]);

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
