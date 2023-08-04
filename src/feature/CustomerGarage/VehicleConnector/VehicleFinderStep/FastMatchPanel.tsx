import React, { useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent, TextField,
} from '@mui/material';
import styled from '@emotion/styled';
import { Theme } from '@emotion/react';
import { vehicleService } from '../../../../service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import * as _ from 'lodash';
import * as C from '../../../../App.constants';
import { useAppSelector, useAppDispatch } from '../../../../App.hooks';
import { RootState } from '../../../../store';
import {
  changeMatchSelections, clearMatchFields,
  fetchMatchVehicles, fetchVehicleByVin,
  setMatchFields, setMatchVehicles,
  setSearchVIN, setTarget
} from '../../../../store/searchVehiclesSlice';
import { Clear } from '@mui/icons-material';
import CardWaitSkeleton from './CardWaitSkeleton';
import VehicleCards from '../../GarageMainPanel/VehicleCard';
import { setConnectedVehicle, setConnectorStep } from '../../../../store/connectedVehicleSlice';

type ItemProps = {
  theme: Theme
}

const S_Selection = styled(Select)(({ theme }:ItemProps) => ({
  ...theme,
  width: 183
}));

const S_FormControl = styled(FormControl)(({theme}:ItemProps) =>({
  ...theme,
  margin: '10px 10px 10px 0'
}));

function FastMatchPanel () {
  const status = useAppSelector((state:RootState) => state.searchVehicles.status);
  const target = useAppSelector((state:RootState) => state.searchVehicles.target);
  const searchVIN = useAppSelector((state:RootState) => state.searchVehicles.searchVIN);
  const vinVehicle = useAppSelector((state:RootState) => state.searchVehicles.vinVehicle);
  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const matchSelections = useAppSelector((state:RootState) => state.searchVehicles.matchSelections);
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);

  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (target === C.VIN) {
      dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: vinVehicle }));
    } else if (target === C.SUBMIT) {
      dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields }));
    } else {
      vehicleService.getForAggregation(target, matchFields).then(
        (response) => {
          switch (target) {
          case C.MAKE:
            dispatch(changeMatchSelections({makers:response.data}));
            return;
          case C.MODEL:
            dispatch(changeMatchSelections({models:response.data}));
            return;
          case C.MODEL_YEAR:
            dispatch(changeMatchSelections({
              modelYears: _.orderBy(response.data, (e) => Number(e), 'desc')
            }));
            return;
          case C.TRIM_LEVEL:
            dispatch(changeMatchSelections({trimLevels:response.data}));
            return;
          default:
            return;
          }
        }
      )
    }
  },[vinVehicle, matchFields]);

  const handleOnChange = (event:SelectChangeEvent<any>) => {
    const field = event.target.name;
    const value = event.target.value;
    dispatch(setTarget(getNextTarget(field)));
    dispatch(setMatchFields({field, value}));
    dispatch(setMatchVehicles([]));
  }

  const handleClearClick = () => {
    cleanUp(C.MAKE);
    dispatch(setSearchVIN(''));
  }

  const handleVinOnChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    cleanUp();
    dispatch(setSearchVIN(event.target.value));
  }

  const handleVinSearch = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (status === C.LOADING) {
      return;
    }

    if (event.key === 'Enter') {
      cleanUp(C.VIN);
      dispatch(fetchVehicleByVin(searchVIN));
    }
  };

  const handleCardClick = (index:number): void => {
    dispatch(setConnectedVehicle(matchVehicles[index]));
    dispatch(setConnectorStep(1));
  }

  const handleGalleryCopyDone = (vehicleId:string, mediaGalleryId:string):void => {
    const updatedMatchVehicles = matchVehicles.map(vehicle => {
      if (vehicle.id === vehicleId) {
        return {...vehicle, mediaGalleryId: mediaGalleryId}
      } else {
        return vehicle;
      }
    });
    dispatch(setMatchVehicles(updatedMatchVehicles));
  }

  const getNextTarget = (target:string) => {
    switch (target) {
    case C.MAKE:
      return C.MODEL;
    case C.MODEL:
      return C.MODEL_YEAR;
    case C.MODEL_YEAR:
      return C.TRIM_LEVEL;
    case C.TRIM_LEVEL:
      return C.SUBMIT;
    default:
      return "";
    }
  }

  const getMatchFieldValue = (fieldName:string) => {
    const matchField = _.find(matchFields, (el) => el.field === fieldName);
    return matchField ? matchField.value : "";
  }

  const cleanUp = (next?:string) => {
    setTarget(next || '');
    if (!_.isEmpty(matchFields)) dispatch(clearMatchFields());
    if (!_.isEmpty(matchVehicles)) dispatch(setMatchVehicles([]));
  }

  return (
    <Box className="dashboard-viewer-box">
      <Box>
        <form>
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
          <br/>OR<br/>
          <S_FormControl>
            <InputLabel htmlFor="maker-selection">Make</InputLabel>
            <S_Selection
              id="maker-selection"
              label="Make"
              name="make"
              defaultValue=""
              value={getMatchFieldValue(C.MAKE)}
              onChange={handleOnChange}
              MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
            >
              { !_.isEmpty(matchSelections.makers) && matchSelections.makers.map((maker, index) => (
                <MenuItem key={index} value={maker}>
                  {maker}
                </MenuItem>
              ))}
            </S_Selection>
          </S_FormControl>
          <S_FormControl>
            <InputLabel htmlFor="model-selection">Model</InputLabel>
            <S_Selection
              id="model-selection"
              label="Model"
              name="model"
              defaultValue=""
              value={getMatchFieldValue(C.MODEL)}
              disabled={_.isEmpty(matchSelections.models)}
              onChange={handleOnChange}
              MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
            >
              { !_.isEmpty(matchSelections.models) && matchSelections.models.map((model, index) => (
                <MenuItem key={index} value={model}>
                  {model}
                </MenuItem>
              ))}
            </S_Selection>
          </S_FormControl>
          <S_FormControl>
            <InputLabel htmlFor="year-selection">Model Year</InputLabel>
            <S_Selection
              id="year-selection"
              label="modelYear"
              name="modelYear"
              defaultValue=""
              value={getMatchFieldValue(C.MODEL_YEAR)}
              disabled={_.isEmpty(matchSelections.modelYears)}
              onChange={handleOnChange}
              MenuProps={{ PaperProps: { sx: { maxHeight: 230 } } }}
            >
              { !_.isEmpty(matchSelections.modelYears) && matchSelections.modelYears.map((modelYear, index) => (
                <MenuItem key={index} value={modelYear}>
                  {modelYear}
                </MenuItem>
              ))}
            </S_Selection>
          </S_FormControl>
          <S_FormControl>
            <InputLabel htmlFor="trim-selection">Trim Level</InputLabel>
            <S_Selection
              id="trim-selection"
              label="trimLevel"
              name="trimLevel"
              defaultValue=""
              value={getMatchFieldValue(C.TRIM_LEVEL)}
              disabled={_.isEmpty(matchSelections.trimLevels)}
              onChange={handleOnChange}
            >
              { !_.isEmpty(matchSelections.trimLevels) && matchSelections.trimLevels.map((trimLevel, index) => (
                <MenuItem key={index} value={trimLevel}>
                  {trimLevel}
                </MenuItem>
              ))}
            </S_Selection>
          </S_FormControl>
        </form>
      </Box>
      { status === C.LOADING ? <CardWaitSkeleton isShown={true}/>
        :
        <VehicleCards
          vehicles={matchVehicles}
          detailsLnkCallback={handleCardClick}
          copyDoneCallback={handleGalleryCopyDone}
        />
      }
    </Box>
  )
}

export default FastMatchPanel;
