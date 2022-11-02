import React, { useState } from 'react';
import { Box, FormControl, IconButton, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import VehicleSearchTable from './VehicleSearchTable';
import { vehicleService } from '../../../service';
import * as C from '../../../App.constants';

function AdvanceSearchPanel () {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const handleClearClick = ():void => {
    setSearchKeyword('');
  }

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    const { value } = event.target;
    setSearchKeyword(value);
  }

  const handleSearch = (event:React.FormEvent<HTMLFormElement> | undefined) => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    vehicleService.getByPublic({ keyword: searchKeyword, page: 1, size: C.DEFAULT_PAGE_SIZE })
      .then(response => {
        setIsSubmitted(false);
        setVehicles(response.data);
      }).catch( error => {
        setIsSubmitted(false);
        console.error(error);
      });
    event && event.preventDefault();
  }

  return (
    <Box className="dashboard-viewer-box">
      <form onSubmit={handleSearch}>
        <FormControl>
          <Box sx={{ pb: 2 }}>
            <TextField
              sx={{ width: "60vh", mt: 2 }}
              name="search"
              placeholder="Find a vehicle by keyword. Say, toyota camry 2021"
              variant="standard"
              value={searchKeyword}
              InputProps={{
                endAdornment: (<IconButton
                  sx={{visibility: searchKeyword? "visible": "hidden"}}
                  onClick={handleClearClick}><Clear/></IconButton>)
              }}
              onChange={handleChange}
            />
            <IconButton sx={{ mt: 2 }} type="submit" aria-label="search" disabled={isSubmitted}>
              <Search color="primary" fontSize="medium" />
            </IconButton>
          </Box>
        </FormControl>
      </form>
      <VehicleSearchTable vehicles={vehicles}/>
    </Box>
  )
}

export default AdvanceSearchPanel;
