import React, { useContext, useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import AdminUser from '../../../security/Auth/AdminUser';
import UserProfile from '../../../security/AuthUser/UserProfile';
import { SideTabsContext } from './SideBarContext';
import { useAppDispatch } from '../../../App.hooks';
import { setCurrentVehicle } from '../../../store/userVehiclesSlice';
import { blankVehicleProfile } from '../../../store/model/VehicleProfile';
import { setConnectorStep } from '../../../store/connectedVehicleSlice';

function VehicleResearchSideTabs () {
  const dispatch = useAppDispatch();
  const {currentTab, setCurrentTab} = useContext(SideTabsContext);

  useEffect(() => {
    if (currentTab === 2) {
      dispatch(setCurrentVehicle(blankVehicleProfile));
    } else {
      dispatch(setConnectorStep(0));
    }
  }, [currentTab]);

  return (
    <Tabs
      className="side-tabs"
      orientation="vertical"
      variant="standard"
      value={currentTab}
      onChange={(event: React.SyntheticEvent, index: number) => setCurrentTab(index)}
    >
      <Tab label="Connect a vehicle"/>
      <Tab label={<AdminUser>Advance Search</AdminUser>} disabled={!UserProfile.isAdmin()}/>
      <Tab label={<AdminUser>New Vehicle</AdminUser>} disabled={!UserProfile.isAdmin()}/>
    </Tabs>
  )
}

export default VehicleResearchSideTabs;