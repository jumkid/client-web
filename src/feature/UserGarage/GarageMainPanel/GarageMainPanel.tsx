import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import VehicleProfileViewer from './VehicleProfileViewer';
import VehicleListViewer from './VehicleListViewer';
import { RootState } from '../../../store';
import { useAppSelector } from '../../../App.hooks';
import VehicleConnector from '../VehicleConnector';

function GarageMainPanel () {
  const [searchKeyword, setSearchKeyword] = useState('');
  const userVehicles = useAppSelector(state => state.userVehicles.vehicles);
  const currentPick = useSelector((state:RootState) => state.userVehicles.currentPick);
  const currentIndex = currentPick - 2;

  return (
    <>
      { currentPick === 0 &&
        <VehicleConnector/>
      }

      { currentPick === 1 &&
        <VehicleListViewer
          searchKeyword={searchKeyword}
          changeSearchKeyword={(value) =>
            setSearchKeyword(()=>value)}
        />
      }

      { currentPick > 1 && <VehicleProfileViewer showName={true} vehicleProfile={userVehicles[currentIndex]} />}
    </>
  );
}

export default GarageMainPanel;
