import React, { useState } from 'react'
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../App.hooks';
import { AppDispatch, RootState } from '../../../store';
import { fetchSearchVehicles, setSearchPage, setSearchPageSize } from '../../../store/searchVehiclesSlice';
import { faCar, faGears, faCarSide } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KeywordMode } from '../../../service/model/CommonTypes';
import * as C from '../../../App.constants';
import { setCurrentVehicle } from '../../../store/userVehiclesSlice';
import { setConnectorStep } from '../../../store/connectedVehicleSlice';

type Props = {
  keyword: string
  vehicles: VehicleProfile[]
}

function VehicleSearchTable ({keyword, vehicles}:Props) {
  const [keywordMode, setKeywordMode] = useState<KeywordMode>(C.MODE_KEYWORD);
  const total = useAppSelector((state:RootState) => state.searchVehicles.searchTotal);
  const page = useAppSelector((state:RootState) => state.searchVehicles.searchPage);
  const pageSize = useAppSelector((state:RootState) => state.searchVehicles.searchPageSize);
  const dispatch = useAppDispatch();

  const changePageAction = (newPage:number) => {
    return (dispatch:AppDispatch) => {
      dispatch(setSearchPage(newPage));
      if (!_.isEmpty(keyword)) {
        // backend page start from 1 instead of 0
        dispatch(fetchSearchVehicles({keyword, keywordMode, page: newPage + 1, size: pageSize}));
      }
    };
  }

  const changeRowsPerPageAction = (pageSize:number) => {
    return (dispatch:AppDispatch) => {
      dispatch(setSearchPageSize(pageSize));
      dispatch(setSearchPage(0));
      if (!_.isEmpty(keyword)) {
        dispatch(fetchSearchVehicles({keyword, keywordMode, page: 1, size: pageSize}));
      }
    };
  }

  const handleRowClick = (vehicle:VehicleProfile):void => {
    dispatch(setCurrentVehicle(vehicle));
    dispatch(setConnectorStep(2));
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changePageAction(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeRowsPerPageAction(Number(event.target.value)));
  };

  return (
    <Box>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="vehicle fast search table">
          <TableHead>
            <TableRow>
              <TableCell>Make</TableCell>
              <TableCell align="right">Model</TableCell>
              <TableCell align="right">Model Year</TableCell>
              <TableCell align="right">Trim Level</TableCell>
              <TableCell align="right"><FontAwesomeIcon icon={faCar} size="1x"/> Engine</TableCell>
              <TableCell align="right"><FontAwesomeIcon icon={faGears} size="1x"/> Transmission</TableCell>
              <TableCell align="right"><FontAwesomeIcon icon={faCarSide} size="1x"/> Drivetrain</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!_.isNil(vehicles) && vehicles.map((vehicle, index) => (
              <TableRow
                key={index}
                hover
                tabIndex={-1}
                onClick={() => handleRowClick(vehicle)}
              >
                <TableCell component="th" scope="row" sx={{ textTransform: "uppercase" }}>{vehicle.make}</TableCell>
                <TableCell align="right" >{vehicle.model}</TableCell>
                <TableCell align="right">{vehicle.modelYear}</TableCell>
                <TableCell align="right" sx={{ textTransform: "uppercase" }}>{vehicle.trimLevel}</TableCell>
                <TableCell align="right">{vehicle.vehicleEngine!.name}</TableCell>
                <TableCell align="right">{vehicle.vehicleTransmission!.name}</TableCell>
                <TableCell align="right">{vehicle.vehicleTransmission!.drivetrain}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default VehicleSearchTable;
