import React, { useEffect } from 'react';
import { Box, Fab, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import { fetchMatchVehicles, fetchVehicleByVin, setSearchVIN } from '../../../../../store/searchVehiclesSlice';
import * as C from '../../../../../App.constants';
import { useAppDispatch, useAppSelector } from '../../../../../App.hooks';
import { RootState } from '../../../../../store';
import CardWaitSkeleton from '../../../../MyVehicles/MainPanels/VehicleCard/CardWaitSkeleton';
import VehicleCards from '../../../../MyVehicles/MainPanels/VehicleCard';
import { setConnectedVehicle, setConnectorStep } from '../../../../../store/connectedVehicleSlice';
import * as _ from 'lodash';
import './index.css';

function VinMatchPanel () {
  const status = useAppSelector((state:RootState) => state.searchVehicles.status);
  const vinVehicle = useAppSelector((state:RootState) => state.searchVehicles.vinVehicle);
  const searchVIN = useAppSelector((state:RootState) => state.searchVehicles.searchVIN);
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const dispatch = useAppDispatch();

  const handleVinOnChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchVIN(event.target.value));
  }

  const handleVinKeypress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleVinSearch();
    }
    return;
  }

  const handleVinSearch = () => {
    if (status === C.LOADING || _.isEmpty(searchVIN)) {
      return;
    }
    dispatch(fetchVehicleByVin(searchVIN));
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
    <Box className="main-container">
      <Box className="vin-search-com">
        <TextField
          name="vin"
          value={searchVIN}
          placeholder="Find a vehicle by knowing VIN number"
          variant="standard"
          InputProps={{
            endAdornment: (<>
              <Clear
                sx={{ visibility: searchVIN? "visible": "hidden", cursor: 'pointer'}}
                onClick={handleClearClick}/>
              <FontAwesomeIcon icon={faBarcode} style={{ marginLeft: 15 }}/>
            </>)
          }}
          onChange={handleVinOnChange}
          onKeyPress={handleVinKeypress}
        />
        <Fab onClick={() => handleVinSearch()} size={'small'} variant="extended">
          <Search fontSize="small"/> Go
        </Fab>
      </Box>

      <Box>
        { status === C.LOADING ? <CardWaitSkeleton isShown={true}/>
          :
          <VehicleCards
            vehicles={matchVehicles}
            detailsLnkCallback={handleCardClick}
            copyDoneCallback={() => {return;}}
          />
        }
      </Box>
    </Box>
  )
}

export default VinMatchPanel;