import React, { useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import { fetchMatchVehicles, fetchVehicleByVin, setSearchVIN } from '../../../../store/searchVehiclesSlice';
import * as C from '../../../../App.constants';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import { S_FormControl, Item } from '../../../../layout/Layout.Theme';
import CardWaitSkeleton from './CardWaitSkeleton';
import VehicleCards from '../../../MyVehicles/MainPanels/VehicleCard';
import { setConnectedVehicle, setConnectorStep } from '../../../../store/connectedVehicleSlice';

function VinMatchPanel () {
  const status = useAppSelector((state:RootState) => state.searchVehicles.status);
  const vinVehicle = useAppSelector((state:RootState) => state.searchVehicles.vinVehicle);
  const searchVIN = useAppSelector((state:RootState) => state.searchVehicles.searchVIN);
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const dispatch = useAppDispatch();

  const handleVinOnChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchVIN(event.target.value));
  }

  const handleVinSearch = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (status === C.LOADING) {
      return;
    }

    if (event.key === 'Enter') {
      dispatch(fetchVehicleByVin(searchVIN));
    }
  };

  const handleCardClick = (index:number): void => {
    dispatch(setConnectedVehicle(matchVehicles[index]));
    dispatch(setConnectorStep(1));
  }

  const handleClearClick = () => {
    dispatch(setSearchVIN(''));
  }

  useEffect(() => {
    dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: vinVehicle }));
  }, [vinVehicle]);

  return (
    <Box>
      <S_FormControl>
        <TextField
          sx={{ width: "60vh" }}
          name="vin"
          value={searchVIN}
          placeholder="Find a vehicle by knowing VIN number"
          variant="outlined"
          InputProps={{
            endAdornment: (<>
              <Clear
                sx={{ visibility: searchVIN? "visible": "hidden", cursor: 'pointer'}}
                onClick={handleClearClick}/>
              <FontAwesomeIcon icon={faBarcode} style={{ marginLeft: 15 }}/>
            </>)
          }}
          onChange={handleVinOnChange}
          onKeyPress={handleVinSearch}
        />
      </S_FormControl>

      <Item>
        { status === C.LOADING ? <CardWaitSkeleton isShown={true}/>
          :
          <VehicleCards
            vehicles={matchVehicles}
            detailsLnkCallback={handleCardClick}
            copyDoneCallback={() => {return;}}
          />
        }
      </Item>

    </Box>
  )
}

export default VinMatchPanel;