import React, { useEffect, useState } from 'react';
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
import { vehicleService } from '../../../service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import * as _ from 'lodash';
import * as C from '../../../App.constants';
import VehicleCardViewer from './FastMatchPanel.VehicleCardViewer';
import { useAppSelector, useAppDispatch } from '../../../App.hooks';
import { RootState } from '../../../store';
import {
  changeMatchSelections, clearMatchFields,
  fetchMatchVehicles, fetchVehicleByVin,
  setMatchFields, setMatchVehicles,
  setSearchVIN
} from '../../../store/searchVehiclesSlice';
import { Clear } from '@mui/icons-material';
import CardWaitSkeleton from './CardWaitSkeleton';

interface ItemProps {
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [target, setTarget] = useState(C.MAKE);

  const searchVIN = useAppSelector((state:RootState) => state.searchVehicles.searchVIN);
  const vinVehicle = useAppSelector((state:RootState) => state.searchVehicles.vinVehicle);
  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const matchSelections = useAppSelector((state:RootState) => state.searchVehicles.matchSelections);
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (target === C.VIN) {
      setIsSubmitted(true);
      dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: vinVehicle })).then(
        () => { setIsSubmitted(false); }
      );
    } else
    if (target === "submit") {
      setIsSubmitted(true);
      dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields })).then(
        () => { setIsSubmitted(false); }
      )
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
    setTarget(getNextTarget(field));
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
    if (event.key === 'Enter') {
      if (isSubmitted) return;
      else setIsSubmitted(true);
      cleanUp(C.VIN);
      dispatch(fetchVehicleByVin(searchVIN)).then(() => { setIsSubmitted(false); });
    }
  };

  const getNextTarget = (target:string) => {
    switch (target) {
    case C.MAKE:
      return C.MODEL;
    case C.MODEL:
      return C.MODEL_YEAR;
    case C.MODEL_YEAR:
      return C.TRIM_LEVEL;
    case C.TRIM_LEVEL:
      return "submit";
    default:
      return C.MAKE;
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
      { <CardWaitSkeleton isShown={isSubmitted}/> }
      { !_.isEmpty(matchVehicles) && <VehicleCardViewer vehicles={matchVehicles}/>}
    </Box>
  )
}

export default FastMatchPanel;
