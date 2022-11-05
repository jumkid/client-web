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
import { VehicleFieldValuePair } from '../../../service/VehicleService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons/faBarcode';
import * as _ from 'lodash';
import * as C from '../../../App.constants';
import { VehicleProfile } from '../../../store/model/VehicleProfile';
import VehicleCardViewer from './FastMatchPanel.VehicleCardViewer';

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

const initialMatchFields:VehicleFieldValuePair[] = [];
const initialMatchVehicles:VehicleProfile[] = [];

function FastMatchPanel () {
  const [makers, setMakers] = useState([]);
  const [models, setModels] = useState([]);
  const [modelYears, setModelYears] = useState([]);
  const [trimLevels, setTrimLevels] = useState([]);
  const [matchFields, setMatchFields] = useState(initialMatchFields);
  const [matchVehicles, setMatchVehicles] = useState(initialMatchVehicles);
  const [nextTarget, setNextTarget] = useState("make");

  useEffect(() => {
    if (nextTarget === "submit") {
      console.log("search matchers");
      vehicleService.getByMatchers({ page: 1, size: C.DEFAULT_PAGE_SIZE }, matchFields).then(
        (response) => {
          setMatchVehicles(response.data.data);
        }
      );
    } else {
      vehicleService.getForAggregation(nextTarget, matchFields).then(
        (response) => {
          switch (nextTarget) {
          case "make":
            setMakers(response.data || []);
            return;
          case "model":
            setModels(response.data || []);
            return;
          case "modelYear":
            setModelYears(response.data || []);
            return;
          case "trimLevel":
            setTrimLevels(response.data || []);
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
    setMatchFields((prevState) => {
      return _.unionWith([{field: field, value: value}], prevState,
        (el1,el2) => {return el1.field === el2.field;});
    });
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
              onChange={handleOnChange}
            >
              { makers.map((maker, index) => (
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
              onChange={handleOnChange}
            >
              { models.map((model, index) => (
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
              onChange={handleOnChange}
            >
              { modelYears.map((modelYear, index) => (
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
              onChange={handleOnChange}
            >
              { trimLevels.map((trimLevel, index) => (
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
