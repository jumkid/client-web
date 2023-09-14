import React, { useContext, useEffect } from 'react';
import {
  Box,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { vehicleService } from '../../../../../service';
import * as _ from 'lodash';
import * as C from '../../../../../App.constants';
import { useAppSelector, useAppDispatch } from '../../../../../App.hooks';
import { RootState } from '../../../../../store';
import {
  changeMatchSelections,
  fetchMatchVehicles,
  setMatchFields, setMatchVehicles,
  setTarget
} from '../../../../../store/searchVehiclesSlice';
import CardWaitSkeleton from '../../../../MyVehicles/MainPanels/VehicleCard/CardWaitSkeleton';
import VehicleCards from '../../../../MyVehicles/MainPanels/VehicleCard';
import { setConnectedVehicle } from '../../../../../store/connectedVehicleSlice';
import { Item, S_FormControl, S_Selection } from '../../../../../layout/Layout.Theme';
import { VehicleConnectorContext } from '../../VehicleConnectorContext';
import './index.css';

function FastMatchPanel () {
  const status = useAppSelector((state:RootState) => state.searchVehicles.status);
  const target = useAppSelector((state:RootState) => state.searchVehicles.target);
  const matchFields = useAppSelector((state:RootState) => state.searchVehicles.matchFields);
  const matchSelections = useAppSelector((state:RootState) => state.searchVehicles.matchSelections);
  const matchVehicles = useAppSelector((state:RootState) => state.searchVehicles.matchVehicles);
  const { setConnectorStep } = useContext(VehicleConnectorContext);

  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (target === C.SUBMIT && !_.isEmpty(matchFields)) {
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
  },[matchFields]);

  const handleOnChange = (event:SelectChangeEvent<any>) => {
    const field = event.target.name;
    const value = event.target.value;
    dispatch(setTarget(getNextTarget(field)));
    dispatch(setMatchFields({field, value}));
    dispatch(setMatchVehicles([]));
  }

  const handleCardClick = (index:number): void => {
    dispatch(setConnectedVehicle(matchVehicles[index]));
    setConnectorStep(1);
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

  return (
    <Box className="main-container">
      <Box height={90}>
        <Item>
          <S_FormControl>
            <InputLabel htmlFor="maker-selection">Make</InputLabel>
            <S_Selection
              id="maker-selection"
              label="Make"
              name="make"
              className="fast-match-select"
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
        </Item>

        <Item>
          <S_FormControl>
            <InputLabel htmlFor="model-selection">Model</InputLabel>
            <S_Selection
              id="model-selection"
              label="Model"
              name="model"
              className="fast-match-select"
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
        </Item>

        <Item>
          <S_FormControl>
            <InputLabel htmlFor="year-selection">Model Year</InputLabel>
            <S_Selection
              id="year-selection"
              label="modelYear"
              name="modelYear"
              className="fast-match-select"
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
        </Item>

        <Item>
          <S_FormControl>
            <InputLabel htmlFor="trim-selection">Trim Level</InputLabel>
            <S_Selection
              id="trim-selection"
              label="trimLevel"
              name="trimLevel"
              className="fast-match-select"
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
        </Item>
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
