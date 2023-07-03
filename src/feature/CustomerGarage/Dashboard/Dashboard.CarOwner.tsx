import React, { useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../GarageSideBar';
import GarageMainPanel from '../GarageMainPanel';
import { fetchUserVehicles } from '../../../store/userVehiclesSlice';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import * as C from '../../../App.constants';

function CarOwner () {
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
      <Box sx={{ maxHeight: '1024px', minWidth: "233px", mb: 10 }} className="dashboard-grid" gridColumn="span 2">
        <GarageSideBar />
      </Box>
      <Box className="dashboard-grid" gridColumn="span 8">
        <GarageMainPanel />
      </Box>
    </MainLayout>
  );
}

export default CarOwner;
