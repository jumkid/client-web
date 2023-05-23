import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { DirectionsCarFilled, ViewList } from '@mui/icons-material';
import { RootState } from '../../../store';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { grey } from '@mui/material/colors';
import { changePick } from '../../../store/userVehiclesSlice';
import SideTabWaitSkeleton from './SideTabWaitSkeleton';

export const SIDE_TABS_OFFSET = 2;

function GarageSideTabs () {
  const userVehicles = useAppSelector(state => state.userVehicles.vehicles);
  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const status = useAppSelector((state: RootState) => state.userVehicles.status);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, index: number):void => {
    dispatch(changePick(index));
  };

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="standard"
        value={currentPick}
        onChange={handleChange}
        sx={{ borderColor: 'divider', width: '100%', p: 0 }}
      >
        <Tab
          sx={{ border: '1px solid', m: '8px 8px 8px 8px' }}
          label="connect a vehicle"
          iconPosition="start"
          icon={<DirectionsCarFilled sx={{ mr: 1 }} />}
        />
        <Tab icon={<ViewList/>} iconPosition="start" label="LIST" sx={{ backgroundColor: grey[900] }}/>
        { userVehicles.map((vehicle, index) =>
          <Tab key={index} label={vehicle.name} sx={{ textAlign: "right" }} wrapped={true}/>
        )}
      </Tabs>
      { <SideTabWaitSkeleton isShown={status === 'loading'} /> }
    </>
  );
}

export default GarageSideTabs;
