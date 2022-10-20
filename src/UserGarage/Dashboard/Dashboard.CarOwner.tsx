import React, { useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../GarageSideBar';
import GarageMainPanel from '../GarageMainPanel';
import { fetchUserVehicles } from '../store/userVehiclesSlice';
import { useAppDispatch, useAppSelector } from '../../App.hooks';

function CarOwner () {
  const dispatch = useAppDispatch();
  const userVehiclesStatus = useAppSelector(state => state.userVehicles.status);
  const userVehicles = useAppSelector(state => state.userVehicles.data);

  useEffect(() => {
    if (userVehiclesStatus === 'idle') {
      dispatch(fetchUserVehicles());
    }
  }, [userVehiclesStatus, dispatch]);

  return (
    <MainLayout menuIndex={0}>
      <Box sx={{ height: '100%', maxHeight: '1024px' }} className="dashboard-box" gridColumn="span 2">
        <GarageSideBar vehicles={userVehicles} />
      </Box>
      <Box className="dashboard-box" gridColumn="span 8">
        <GarageMainPanel vehicles={userVehicles} />
      </Box>
    </MainLayout>
  );
}

export default CarOwner;
