import React, { useContext, useEffect } from 'react';
import { SideTabsContext } from '../SideBar/SideBarContext';
import { Box } from '@mui/material';
import VehicleResearchSideBar from '../SideBar';
import VehicleConnector from '../VehicleConnector';
import VehicleProfileForm from '../../MyVehicles/MainPanels/VeichleProfileForm/VehicleProfileForm';
import { useAppDispatch } from '../../../App.hooks';
import { setCurrentVehicle } from '../../../store/userVehiclesSlice';
import { blankVehicleProfile } from '../../../store/model/VehicleProfile';
import FormActionsBar from '../../MyVehicles/MainPanels/VeichleProfileForm/FormActionsBar';

function VehicleResearchMainPanel () {

  const {currentTab} = useContext(SideTabsContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentTab == 1) {
      dispatch(setCurrentVehicle(blankVehicleProfile));
    }
  }, [currentTab]);

  return (
    <>
      <Box sx={{ maxHeight: '1024px', minWidth: "233px", mb: 10 }} className="dashboard-grid" gridColumn="span 2">
        <VehicleResearchSideBar/>
      </Box>
      <Box className="dashboard-grid" gridColumn="span 8">
        { currentTab == 0 && <VehicleConnector/> }
        { currentTab == 1 &&
        <>
          <Box mx={2} mt={2} mb={1}><FormActionsBar /></Box>
          <VehicleProfileForm />
        </> }
      </Box>
    </>
  )
}

export default VehicleResearchMainPanel;