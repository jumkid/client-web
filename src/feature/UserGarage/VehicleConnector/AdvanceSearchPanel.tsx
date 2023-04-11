import React, { useState } from 'react';
import { Box, FormControl, IconButton, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import VehicleSearchTable from './VehicleSearchTable';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { clearSearchKeyword, fetchSearchVehicles, setSearchKeyword } from '../../../store/searchVehiclesSlice';
import { RootState } from '../../../store';
import * as _ from 'lodash';

function AdvanceSearchPanel () {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const searchKeyword = useAppSelector((state:RootState) => state.searchVehicles.searchKeyword);
  const searchVehicles = useAppSelector((state:RootState) => state.searchVehicles.searchVehicles);
  const searchPage = useAppSelector((state:RootState) => state.searchVehicles.searchPage);
  const searchPageSize = useAppSelector((state:RootState) => state.searchVehicles.searchPageSize);
  const dispatch = useAppDispatch();

  const handleClearClick = ():void => {
    dispatch(clearSearchKeyword());
  }

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    dispatch(setSearchKeyword(event.target.value));
  }

  const handleSearch = async (event: React.FormEvent<HTMLFormElement> | undefined): Promise<void> => {
    event && event.preventDefault();

    if (isSubmitted) {
      return;
    }

    if (isValid) {
      setIsSubmitted(true);
      await dispatch(fetchSearchVehicles({keyword: searchKeyword, page: searchPage, size: searchPageSize}));
      setIsSubmitted(false);
    }
  }

  const isValid = !_.isEmpty(searchKeyword);

  return (
    <Box className="dashboard-viewer-box">
      <form onSubmit={handleSearch}>
        <FormControl>
          <Box sx={{ pb: 2 }}>
            <TextField
              sx={{ width: "60vh", mt: 2, height: 50 }}
              name="search"
              placeholder="Find a vehicle by keyword. Say, toyota camry 2021"
              variant="standard"
              value={searchKeyword}
              InputProps={{
                startAdornment: (<Search color="primary" fontSize="medium" sx={{ mr: 1 }}/>),
                endAdornment: (<IconButton
                  sx={{visibility: searchKeyword? "visible": "hidden"}}
                  onClick={handleClearClick}><Clear/></IconButton>)
              }}
              onChange={handleChange}
              error={!isValid}
              helperText={!isValid && "Please type in search keyword"}
            />
          </Box>
        </FormControl>
      </form>
      <VehicleSearchTable keyword={searchKeyword} vehicles={searchVehicles}/>
    </Box>
  )
}

export default AdvanceSearchPanel;
