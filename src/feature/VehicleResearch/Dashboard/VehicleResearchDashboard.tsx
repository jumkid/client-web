import React, { useMemo, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { SideTabsContext } from '../SideBar/SideBarContext';
import { Box } from '@mui/material';
import VehicleResearchSideBar from '../SideBar';
import VehicleConnector from '../VehicleConnector';
import FormActionsBar from '../../MyVehicles/MainPanels/VeichleProfileForm/FormActionsBar';
import VehicleProfileForm from '../../MyVehicles/MainPanels/VeichleProfileForm/VehicleProfileForm';
import AdvanceSearchConnector from '../AdvanceSearch';

function VehicleResearchDashboard () {
  const [currentTab, setCurrentTab] = useState(0);
  const sideTabsProvider = useMemo(() => ({currentTab, setCurrentTab}), [currentTab, setCurrentTab]);

  return (
    <MainLayout mode="dark" menuIndex={1}>
      <SideTabsContext.Provider  value={sideTabsProvider}>
        <>
          <Box className="side-bar-panel" gridColumn="span 2">
            <VehicleResearchSideBar/>
          </Box>

          <Box className="main-panel" gridColumn="span 8">
            { currentTab == 0 && <VehicleConnector/> }
            { currentTab == 1 && <AdvanceSearchConnector/> }
            { currentTab == 2 &&
              <Box>
                <Box className="tool-bar-container"><FormActionsBar /></Box>
                <VehicleProfileForm />
              </Box>
            }
          </Box>
        </>
      </SideTabsContext.Provider>
    </MainLayout>
  );
}

export default VehicleResearchDashboard;
