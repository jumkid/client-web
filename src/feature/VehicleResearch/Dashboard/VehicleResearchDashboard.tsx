import React, { useMemo, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { SideTabsContext } from '../SideBar/SideBarContext';
import VehicleResearchMainPanel from '../VehicleResearchMainPanel';

function VehicleResearchDashboard () {

  const [currentTab, setCurrentTab] = useState(0);
  const sideTabsProvider = useMemo(() => ({currentTab, setCurrentTab}), [currentTab, setCurrentTab]);

  return (
    <MainLayout mode="dark" menuIndex={1}>
      <SideTabsContext.Provider  value={sideTabsProvider}>
        <VehicleResearchMainPanel/>
      </SideTabsContext.Provider>
    </MainLayout>
  );
}

export default VehicleResearchDashboard;
