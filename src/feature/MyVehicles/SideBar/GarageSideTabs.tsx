import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { ViewList } from '@mui/icons-material';
import { RootState } from '../../../store';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { changePick } from '../../../store/userVehiclesSlice';
import * as _ from 'lodash';

function GarageSideTabs () {
  const userVehicles = useAppSelector(state => state.userVehicles.vehicles);
  const currentPick = useAppSelector((state: RootState) => state.userVehicles.currentPick);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, index: number):void => {
    dispatch(changePick(index));
  };

  return (
    <Tabs
      className="side-tabs"
      orientation="vertical"
      variant="standard"
      value={currentPick}
      onChange={handleChange}
    >
      <Tab icon={<ViewList/>} iconPosition="start" label="My Vehicles"/>

      { !_.isNil(userVehicles) && userVehicles.map((vehicle, index) =>
        <Tab className="side-tabs-dynamic-item" key={index} label={vehicle.name} wrapped={true}/>
      )}
    </Tabs>
  );
}

export default GarageSideTabs;
