import React, { useContext, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import AdminUser from '../../../security/Auth/AdminUser';
import UserProfile from '../../../security/AuthUser/UserProfile';
import { SideTabsContext } from './SideBarContext';

function VehicleResearchSideTabs () {

  const {currentTab, setCurrentTab} = useContext(SideTabsContext);

  return (
    <Tabs
      orientation="vertical"
      variant="standard"
      value={currentTab}
      onChange={(event: React.SyntheticEvent, index: number) => setCurrentTab(index)}
      className="tab_fullwidth"
    >
      <Tab label="Connect a vehicle" sx={{m:1}}/>
      <Tab label={<AdminUser>Create New Vehicle</AdminUser>} disabled={!UserProfile.isAdmin()} sx={{m:1}}/>
    </Tabs>
  )
}

export default VehicleResearchSideTabs;