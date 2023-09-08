import React, { useContext, useEffect, useState } from 'react';
import { Box, Fab, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import { fetchVehicleByVin, setVinVehicle } from '../../../../../store/searchVehiclesSlice';
import * as C from '../../../../../App.constants';
import { useAppDispatch, useAppSelector } from '../../../../../App.hooks';
import { RootState } from '../../../../../store';
import CardWaitSkeleton from '../../../../MyVehicles/MainPanels/VehicleCard/CardWaitSkeleton';
import VehicleCards from '../../../../MyVehicles/MainPanels/VehicleCard';
import { setConnectedVehicle } from '../../../../../store/connectedVehicleSlice';
import * as _ from 'lodash';
import './index.css';
import { blankVehicleProfile } from '../../../../../store/model/VehicleProfile';
import { VehicleConnectorContext } from '../../VehicleConnectorContext';

function VinMatchPanel () {
  const [searchVIN, setSearchVIN] = useState('');

  const status = useAppSelector((state:RootState) => state.searchVehicles.status);
  const vinVehicle = useAppSelector((state:RootState) => state.searchVehicles.vinVehicle);

  const {setConnectorStep} = useContext(VehicleConnectorContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleClear();
  }, []);

  const handleVinOnChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchVIN(event.target.value);
  }

  const handleVinKeypress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleVinSearch();
    }
  }

  const handleVinSearch = () => {
    if (status !== C.LOADING && !_.isEmpty(searchVIN)) {
      dispatch(fetchVehicleByVin(searchVIN));
    }
  };

  const handleCardClick = (): void => {
    dispatch(setConnectedVehicle(vinVehicle));
    setConnectorStep(1);
  }

  const handleClear = () => {
    dispatch(setVinVehicle(blankVehicleProfile));
    dispatch(setConnectedVehicle(blankVehicleProfile));
    setSearchVIN('');
  }

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
                onClick={handleClear}/>
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
            vehicles={[vinVehicle]}
            detailsLnkCallback={handleCardClick}
            copyDoneCallback={() => {return;}}
          />
        }
      </Box>
    </Box>
  )
}

export default VinMatchPanel;