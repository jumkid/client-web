import React, { useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { Box } from '@mui/material';
import GarageSideBar from '../GarageSideBar';
import './Dashboard.black.css';
import GarageMainPanel from '../GarageMainPanel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserVehicles } from '../store/userVehiclesSlice';

function CarOwner () {
  const dispatch = useDispatch();
  const userVehiclesStatus = useSelector(state => state.userVehicles.status);
  const userVehicles = useSelector(state => state.userVehicles.data);

  useEffect(() => {
    if (userVehiclesStatus === 'idle') {
      dispatch(fetchUserVehicles());
    }
  }, [userVehiclesStatus, dispatch]);

  return (
    <MainLayout>
      <Box className="dashboard-box" gridColumn="span 2">
        <GarageSideBar vehicles={userVehicles} />
      </Box>
      <Box className="dashboard-box" gridColumn="span 8">
        <GarageMainPanel vehicles={userVehicles} />
      </Box>
    </MainLayout>
  );
}

export default CarOwner;
