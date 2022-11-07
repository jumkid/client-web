import React from 'react'
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
import { setConnectedVehicle, setConnectorStep } from '../../../store/connectedVehicleSlice';
import { AppDispatch, RootState } from '../../../store';
import { fetchSearchVehicles, setSearchPage, setSearchPageSize } from '../../../store/searchVehiclesSlice';
import * as _ from 'lodash';

interface Props {
  keyword: string
  vehicles: VehicleProfile[]
}

function VehicleSearchTable ({keyword, vehicles}:Props) {
  const total = useAppSelector((state:RootState) => state.searchVehicles.searchTotal);
  const page = useAppSelector((state:RootState) => state.searchVehicles.searchPage);
  const pageSize = useAppSelector((state:RootState) => state.searchVehicles.searchPageSize);
  const dispatch = useAppDispatch();

  const changePageAction = (newPage:number) => {
    return (dispatch:AppDispatch) => {
      dispatch(setSearchPage(newPage));
      if (!_.isEmpty(keyword)) {
        // backend page start from 1 instead of 0
        dispatch(fetchSearchVehicles({keyword, page: newPage + 1, size: pageSize}));
      }
    };
  }

  const changeRowsPerPageAction = (pageSize:number) => {
    return (dispatch:AppDispatch) => {
      dispatch(setSearchPageSize(pageSize));
      dispatch(setSearchPage(0));
      if (!_.isEmpty(keyword)) {
        dispatch(fetchSearchVehicles({keyword, page: 1, size: pageSize}));
      }
    };
  }

  const handleRowClick = (vehicle:VehicleProfile):void => {
    dispatch(setConnectedVehicle(vehicle));
    dispatch(setConnectorStep(1));
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(changePageAction(newPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeRowsPerPageAction(Number(event.target.value)));
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ overflowX: 'hidden', maxHeight: '55vh' }}>
        <Table stickyHeader aria-label="vehicle fast search table">
          <TableHead>
            <TableRow>
              <TableCell>Make</TableCell>
              <TableCell align="right">Model</TableCell>
              <TableCell align="right">Model Year</TableCell>
              <TableCell align="right">Trim Level</TableCell>
              <TableCell align="right">Variant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle, index) => (
              <TableRow
                key={index}
                hover
                tabIndex={-1}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleRowClick(vehicle)}
              >
                <TableCell component="th" scope="row">{vehicle.make}</TableCell>
                <TableCell align="right">{vehicle.model}</TableCell>
                <TableCell align="right">{vehicle.modelYear}</TableCell>
                <TableCell align="right">{vehicle.trimLevel}</TableCell>
                <TableCell align="right">...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}

export default VehicleSearchTable;
