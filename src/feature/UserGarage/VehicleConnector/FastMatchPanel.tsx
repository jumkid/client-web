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
import { changeMatchSelections, fetchMatchVehicles, setMatchFields } from '../../../store/searchVehiclesSlice';

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
  const [nextTarget, setNextTarget] = useState("make");

  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const matchSelections = useAppSelector((state:RootState) => state.searchVehicles.matchSelections);
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (nextTarget === "submit") {
      dispatch(fetchMatchVehicles({ page: 1, size: C.DEFAULT_PAGE_SIZE, data: matchFields }));
    } else {
      vehicleService.getForAggregation(nextTarget, matchFields).then(
        (response) => {
          switch (nextTarget) {
          case "make":
            dispatch(changeMatchSelections({makers:response.data}));
            return;
          case "model":
            dispatch(changeMatchSelections({models:response.data}));
            return;
          case "modelYear":
            dispatch(changeMatchSelections({
              modelYears: _.orderBy(response.data, (e) => Number(e), 'desc')
            }));
            return;
          case "trimLevel":
            dispatch(changeMatchSelections({trimLevels:response.data}));
            return;
          default:
            return;
          }
        }
      )
    }
  },[matchFields]);

  const handleOnChange = (event:SelectChangeEvent<any>) => {
    const field = event.target.name;
    const value = event.target.value;
    setNextTarget(getNextTarget(field));
    dispatch(setMatchFields({field, value}));
  }

  const getNextTarget = (target:string) => {
    switch (target) {
    case "make":
      return "model";
    case "model":
      return "modelYear";
    case "modelYear":
      return "trimLevel";
    case "trimLevel":
      return "submit";
    default:
      return "make";
    }
  }

  const getMatchFieldValue = (fieldName:string) => {
    const matchField = _.find(matchFields, (el) => el.field === fieldName);
    return matchField ? matchField.value : "";
  }

  return (
    <Box className="dashboard-viewer-box">
      <Box>
        <form>
          <S_FormControl>
            <TextField
              sx={{ width: "60vh" }}
              name="vin"
              placeholder="Find a vehicle by knowing VIN number"
              variant="outlined"
              InputProps={{
                endAdornment: (<FontAwesomeIcon icon={faBarcode} style={{ marginLeft: 15 }}/>)
              }}
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
              value={getMatchFieldValue("make")}
              onChange={handleOnChange}
            >
              { matchSelections.makers.map((maker, index) => (
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
              value={getMatchFieldValue("model")}
              onChange={handleOnChange}
            >
              { matchSelections.models.map((model, index) => (
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
              value={getMatchFieldValue("modelYear")}
              onChange={handleOnChange}
            >
              { matchSelections.modelYears.map((modelYear, index) => (
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
              value={getMatchFieldValue("trimLevel")}
              onChange={handleOnChange}
            >
              { matchSelections.trimLevels.map((trimLevel, index) => (
                <MenuItem key={index} value={trimLevel}>
                  {trimLevel}
                </MenuItem>
              ))}
            </S_Selection>
          </S_FormControl>
        </form>
      </Box>
      { !_.isEmpty(matchVehicles) && <VehicleCardViewer vehicles={matchVehicles}/>}
    </Box>
  )
}

export default FastMatchPanel;
