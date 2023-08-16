import React, { useEffect, useState } from 'react';
import { Box, Fab, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import VehicleSearchTable from './VehicleSearchTable';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { clearSearchKeyword, fetchSearchVehicles, setSearchKeyword } from '../../../store/searchVehiclesSlice';
import { RootState } from '../../../store';
import * as _ from 'lodash';
import './index.css';

function AdvanceSearchPanel () {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStep = useAppSelector((state:RootState) => state.connectedVehicle.connectorStep);
  const searchKeyword = useAppSelector((state:RootState) => state.searchVehicles.searchKeyword);
  const searchVehicles = useAppSelector((state:RootState) => state.searchVehicles.searchVehicles);
  const searchPage = useAppSelector((state:RootState) => state.searchVehicles.searchPage);
  const searchPageSize = useAppSelector((state:RootState) => state.searchVehicles.searchPageSize);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentStep === 1) {
      dispatch(fetchSearchVehicles({keyword: searchKeyword, page: searchPage, size: searchPageSize}));
    }
  }, [currentStep]);

  const handleClearClick = ():void => {
    dispatch(clearSearchKeyword());
  }

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    dispatch(setSearchKeyword(event.target.value));
  }

  const handleSearchKeypress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await handleSearch();
    }
    return;
  }

  const handleSearch = async () => {
    if (isSubmitted || _.isEmpty(searchKeyword)) {
      return;
    }
    setIsSubmitted(true);
    await dispatch(fetchSearchVehicles({keyword: searchKeyword, page: searchPage, size: searchPageSize}));
    setIsSubmitted(false);
  }

  return (
    <Box className="main-container">
      <Box className="adv-search-com">
        <TextField
          name="search"
          placeholder="Search by keyword. Say, toyota camry 2021"
          variant="standard"
          value={searchKeyword}
          InputProps={{
            endAdornment: (
              <Clear
                sx={{ visibility: searchKeyword? "visible": "hidden", cursor: 'pointer'}}
                onClick={handleClearClick}/>
            )
          }}
          onChange={handleChange}
          onKeyPress={handleSearchKeypress}
        />

        <Fab onClick={() => handleSearch()} size={'small'} variant="extended">
          <Search fontSize="small"/> Go
        </Fab>
      </Box>

      <VehicleSearchTable keyword={searchKeyword} vehicles={searchVehicles}/>
    </Box>
  )
}

export default AdvanceSearchPanel;
