import React, { useState } from 'react';
import {
  Box, Fab,
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
  setPageSize, setUserVehicles, SIDE_TABS_OFFSET
} from '../../../store/userVehiclesSlice';
import { AppDispatch, RootState } from '../../../store';
import CardWaitSkeleton from './VehicleCard/CardWaitSkeleton';
import * as _ from 'lodash';
import * as C from '../../../App.constants';
import VehicleCards from './VehicleCard';
import { KeywordMode } from '../../../service/model/CommonTypes';
import './VehicleListViewer.css';

function VehicleListViewer () {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const keyword = useAppSelector((state:RootState) => state.userVehicles.keyword);
  const [keywordMode, setKeywordMode] = useState<KeywordMode>(C.MODE_KEYWORD);
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
      dispatch(fetchUserVehicles({keyword, keywordMode, page: newPage + 1, size: pageSize}));
    }
  };

  const changeRowsPerPageAction = (pageSize:number):(dispatch: AppDispatch) => void => {
    return (dispatch:AppDispatch) => {
      dispatch(setPageSize(pageSize));
      dispatch(setPage(0));
      dispatch(fetchUserVehicles({keyword, keywordMode, page: 1, size: pageSize}));
    }
  };

  const handleSearch = (event:React.FormEvent<HTMLFormElement> | null):void => {
    if (isSubmitted) { return; }
    dispatch(setPage(0));
    setIsSubmitted(true);
    dispatch(fetchUserVehicles({ keyword, keywordMode, page: 0, size: pageSize }))
      .then(() => {
        setIsSubmitted(false);
      }, () => {setIsSubmitted(false);});
    event && event.preventDefault();
  };

  const handleClearClick = ():void => {
    dispatch(clearKeyword());
    setIsSubmitted(true);
    dispatch(fetchUserVehicles({ keyword: '', keywordMode, page, size: pageSize }))
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

  const handleGalleryCopyDone = (vehicleId:string, mediaGalleryId:string):void => {
    const updatedUserVehicles = userVehicles.map(vehicle => {
      if (vehicle.id === vehicleId) {
        return {...vehicle, mediaGalleryId: mediaGalleryId}
      } else {
        return vehicle;
      }
    });
    dispatch(setUserVehicles(updatedUserVehicles));
  }

  return (
    <Box className="main-container">
      <form onSubmit={handleSearch}>
        <FormControl>
          <Box>
            <TextField
              className="search-input"
              name="search"
              placeholder="Search your vehicles"
              variant="standard"
              value={keyword}
              onChange={handleSearchChange}
              disabled={isSubmitted}
              InputProps={{
                endAdornment: (<IconButton
                  sx={{visibility: keyword? "visible": "hidden"}}
                  onClick={handleClearClick}><Clear/></IconButton>)
              }}
            />
            <Fab className="search-btn" onClick={() => handleSearch(null)} size={'small'} variant="extended">
              <Search fontSize="small"/> Go
            </Fab>
          </Box>
        </FormControl>
      </form>

      <Box>
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
          _.isNil(userVehicles) || _.isEmpty(userVehicles) ?
            <Typography variant='h6' m={3}>There is no vehicle in your garage, click the connect button to start.</Typography>
            :
            <VehicleCards
              vehicles={userVehicles}
              detailsLnkCallback={handleClick}
              copyDoneCallback={handleGalleryCopyDone}
            />
        }
      </Box>
    </Box>
  );
}

export default VehicleListViewer;
