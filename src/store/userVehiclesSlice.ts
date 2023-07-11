import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VehicleProfile } from './model/VehicleProfile';
import { vehicleService } from '../service';
import { PagingSearch, VehicleProfileUpdate } from '../service/model/Request';
import * as C from '../App.constants';
import * as _ from 'lodash';
import { FormStatus } from '../service/model/CommonTypes';

export const fetchUserVehicles = createAsyncThunk('userVehicles/fetchUserVehicles',
  async (pagingSearch:PagingSearch) => { return vehicleService.getByUser(pagingSearch); }
);

export const updateUserVehicleName = createAsyncThunk('userVehicles/updateName',
  async (vehicleUpdate:VehicleProfileUpdate) => { return vehicleService.updateName(vehicleUpdate.id, vehicleUpdate.vehicle); }
);

export const updateVehicle = createAsyncThunk('userVehicles/update',
  async (vehicleUpdate:VehicleProfileUpdate) => { return vehicleService.update(vehicleUpdate.id, vehicleUpdate.vehicle); }
);

export const saveNewVehicle = createAsyncThunk('userVehicles/saveNew',
  async (vehicleProfile:VehicleProfile) => { return vehicleService.saveAsNew(vehicleProfile); }
);

export const deleteVehicle = createAsyncThunk('userVehicles/delete',
  async (id:string) => { return vehicleService.delete(id); }
);

interface UserVehicleListState {
  currentPick: number
  currentVehicle: VehicleProfile | null
  currentVehicleStatus: FormStatus
  vehicles: VehicleProfile[]
  keyword: string
  total: number
  page: number
  pageSize: number
  status: FormStatus
  error?: string | undefined
}

const initialState: UserVehicleListState = {
  currentPick: 1,
  keyword: '',
  total: 0,
  page: 0,
  pageSize: C.DEFAULT_PAGE_SIZE,
  vehicles: [],
  currentVehicle: null,
  currentVehicleStatus: C.IDLE,
  status: C.IDLE,
  error: ''
};

export const userVehiclesSlice = createSlice({
  name: 'userVehicles',

  initialState,

  reducers: {
    changePick: (state, action) => {
      const pick = action.payload;
      state.currentPick = pick;
      if (pick > 1) state.currentVehicle = state.vehicles[pick - 2];
    },
    setCurrentVehicle: (state, action) => {
      state.currentVehicle = action.payload;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearKeyword: (state) => {
      state.keyword = '';
      state.total = 0;
      state.page = 0;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    removeVehicleFromList: (state, action) => {
      const index = action.payload;
      state.vehicles.splice(index, 1);
    },
    syncCurrentVehicleToList: (state) => {
      if (!_.isNull(state.currentVehicle)
        && state.currentPick > 1
        && state.vehicles[state.currentPick - 2].id === state.currentVehicle.id) {
        state.vehicles[state.currentPick - 2] = state.currentVehicle;
      }
    },
    changeMake: (state, action) => {
      state.currentVehicle!.make = action.payload;
    },
    changeModel: (state, action) => {
      state.currentVehicle!.model = action.payload;
    },
    changeTrimLevel: (state, action) => {
      state.currentVehicle!.trimLevel = action.payload;
    },
    changeModelYear: (state, action) => {
      state.currentVehicle!.modelYear = action.payload;
    },
    changeAccessScope:  (state, action) => {
      state.currentVehicle!.accessScope = action.payload;
    },
    changeMediaGalleryId: (state, action) => {
      state.currentVehicle!.mediaGalleryId = action.payload;
    },
    changePricingMSRP: (state, action) => {
      if (_.isNil(state.currentVehicle!.vehiclePricing)) {
        state.currentVehicle!.vehiclePricing = { id:null, msrp:0 }
      }
      state.currentVehicle!.vehiclePricing.msrp = action.payload;
    },
    changeEngineType: (state, action) => {
      state.currentVehicle!.vehicleEngine!.type = action.payload;
    },
    changeEngineName: (state, action) => {
      state.currentVehicle!.vehicleEngine!.name = action.payload;
    },
    changeEngineFuelType: (state, action) => {
      state.currentVehicle!.vehicleEngine!.fuelType = action.payload;
    },
    changeEngineCylinder: (state, action) => {
      state.currentVehicle!.vehicleEngine!.cylinder = action.payload;
    },
    changeEngineDisplacement: (state, action) => {
      state.currentVehicle!.vehicleEngine!.displacement = action.payload;
    },
    changeEngineHorsepower: (state, action) => {
      state.currentVehicle!.vehicleEngine!.horsepower = action.payload;
    },
    changeEngineHorsepowerRpm: (state, action) => {
      state.currentVehicle!.vehicleEngine!.horsepowerRpm = action.payload;
    },
    changeEngineCode: (state, action) => {
      state.currentVehicle!.vehicleEngine!.manufacturerEngineCode = action.payload;
    },
    changeEngineTorque: (state, action) => {
      state.currentVehicle!.vehicleEngine!.torque = action.payload;
    },
    changeEngineTorqueRpm: (state, action) => {
      state.currentVehicle!.vehicleEngine!.torqueRpm = action.payload;
    },
    changeTransmissionName: (state, action) => {
      state.currentVehicle!.vehicleTransmission!.name = action.payload;
    },
    changeTransmissionType: (state, action) => {
      state.currentVehicle!.vehicleTransmission!.type = action.payload;
    },
    changeTransmissionAutomaticType: (state, action) => {
      state.currentVehicle!.vehicleTransmission!.automaticType = action.payload;
    },
    changeTransmissionAvailability: (state, action) => {
      state.currentVehicle!.vehicleTransmission!.availability = action.payload;
    },
    changeTransmissionDrivetrain: (state, action) => {
      state.currentVehicle!.vehicleTransmission!.drivetrain = action.payload;
    },
    changeTransmissionNumberOfSpeeds: (state, action) => {
      state.currentVehicle!.vehicleTransmission!.numberOfSpeeds = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserVehicles.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        state.vehicles = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUserVehicles.rejected, (state, action) => {
        state.status = C.FAILED;
        state.error = action.error.message;
      })
      .addCase(updateVehicle.pending, (state) => {
        state.currentVehicleStatus = C.LOADING;
      })
      .addCase(updateVehicle.fulfilled, (state) => {
        state.currentVehicleStatus = C.SUCCEEDED;
      })
      .addCase(saveNewVehicle.pending, (state) => {
        state.currentVehicleStatus = C.LOADING;
      })
      .addCase(saveNewVehicle.fulfilled, (state, action) => {
        state.currentVehicleStatus = C.SUCCEEDED;
        if (action.payload.status === 201) {
          state.vehicles.push(action.payload.data);
        }
      })
      .addCase(updateUserVehicleName.fulfilled, (state, action) => {
        state.currentVehicleStatus = C.SUCCEEDED;
        if (action.payload.status === 202) {
          // the first two index (0 and 1) of tabs are used for specific actions
          const index = state.currentPick - 2;
          state.vehicles[index] = action.payload.data;
        }
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.currentVehicleStatus = C.LOADING;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.currentVehicleStatus = C.SUCCEEDED;
      });
  }
});

export const {
  changePick, setCurrentVehicle,
  setKeyword, clearKeyword, setPage, setPageSize, removeVehicleFromList, syncCurrentVehicleToList,
  changeMake, changeModel, changeTrimLevel, changeModelYear, changeAccessScope, changeMediaGalleryId,
  changePricingMSRP,
  changeEngineType, changeEngineName, changeEngineFuelType, changeEngineHorsepower, changeEngineCode,
  changeEngineCylinder, changeEngineDisplacement, changeEngineTorque, changeEngineTorqueRpm, changeEngineHorsepowerRpm,
  changeTransmissionName, changeTransmissionType, changeTransmissionAvailability, changeTransmissionAutomaticType,
  changeTransmissionDrivetrain, changeTransmissionNumberOfSpeeds
} = userVehiclesSlice.actions;

export default userVehiclesSlice.reducer;
