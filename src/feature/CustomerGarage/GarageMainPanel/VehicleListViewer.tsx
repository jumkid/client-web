import React, { useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  TablePagination,
  TextField, Typography
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import {
  changePick,
  clearKeyword,
  fetchUserVehicles,
  setKeyword,
  setPage,
  setPageSize
} from '../../../store/userVehiclesSlice';
import { AppDispatch, RootState } from '../../../store';
import CardWaitSkeleton from '../VehicleConnector/VehicleFinderStep/CardWaitSkeleton';
import * as _ from 'lodash';
import * as C from '../../../App.constants';
import VehicleCard from './VehicleListViewer.VehicleCard';
import { SIDE_TABS_OFFSET } from '../GarageSideBar/GarageSideTabs';

function VehicleListViewer () {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const keyword = useAppSelector((state:RootState) => state.userVehicles.keyword);
  const total = useAppSelector((state:RootState) => state.userVehicles.total);
  const page = useAppSelector((state:RootState) => state.userVehicles.page);
  const pageSize = useAppSelector((state:RootState) => state.userVehicles.pageSize);
  const userVehicles = useAppSelector(state => state.userVehicles.vehicles);
  const status = useAppSelector(state => state.userVehicles.status);
  const dispatch = useAppDispatch();

  const changePageAction = (newPage:number):(dispatch: AppDispatch) => void => {
    return (dispatch:AppDispatch) => {
      dispatch(setPage(newPage));
      // backend page start from 1 instead of 0
      dispatch(fetchUserVehicles({keyword, page: newPage + 1, size: pageSize}));
    }
  };

  const changeRowsPerPageAction = (pageSize:number):(dispatch: AppDispatch) => void => {
    return (dispatch:AppDispatch) => {
      dispatch(setPageSize(pageSize));
      dispatch(setPage(0));
      dispatch(fetchUserVehicles({keyword, page: 1, size: pageSize}));
    }
  };

  const handleSearch = (event:React.FormEvent<HTMLFormElement> | undefined):void => {
    if (isSubmitted) { return; }

    setIsSubmitted(true);
    dispatch(fetchUserVehicles({ keyword, page, size: pageSize }))
      .then(() => {
        setIsSubmitted(false);
      }, () => {setIsSubmitted(false);});
    event && event.preventDefault();
  };

  const handleClearClick = ():void => {
    dispatch(clearKeyword());
    setIsSubmitted(true);
    dispatch(fetchUserVehicles({ keyword: '', page, size: pageSize }))
      .then(() => {
        setIsSubmitted(false);
      });
  };

  const handleSearchChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    const { value } = event.target;
    dispatch(setKeyword(value));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changePageAction(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeRowsPerPageAction(Number(event.target.value)));
  };

  const handleClick = (index:number):void => {
    // the first two index (0 and 1) of tabs are used for specific actions
    dispatch(changePick(index + SIDE_TABS_OFFSET));
  };

  return (
    <Box>
      <form onSubmit={handleSearch}>
        <FormControl>
          <Box sx={{ p: 2 }}>
            <TextField
              sx={{ width: "480px", mt: 2 }}
              name="search"
              placeholder="search vehicles in your garage"
              variant="standard"
              value={keyword}
              onChange={handleSearchChange}
              disabled={isSubmitted}
              InputProps={{
                startAdornment: <Search color="primary" fontSize="medium" sx={{ mr:1 }}/>,
                endAdornment: (<IconButton
                  sx={{visibility: keyword? "visible": "hidden"}}
                  onClick={handleClearClick}><Clear/></IconButton>)
              }}
            />
          </Box>
        </FormControl>
      </form>

      <Box sx={{ p:1 }}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[10, 15, 25]}
          labelRowsPerPage="Vehicles per page"
          onRowsPerPageChange={handleChangeRowsPerPage}
          variant="head"
        />
        { status === C.LOADING ?  <CardWaitSkeleton isShown={true} /> :
          _.isNil(userVehicles) || _.isEmpty(userVehicles) ? (
            <Typography variant='h6' m={3}>There is no vehicle in your garage, click the connect button to start.</Typography>
          ) : (
            userVehicles.map((vehicle, index) => (
              <VehicleCard key={index} vehicle={vehicle} callback={() => handleClick(index)}/>
            ))
          )}
      </Box>
    </Box>
  );
}

export default VehicleListViewer;
