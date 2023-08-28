import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VehicleProfile, blankVehicleProfile } from './model/VehicleProfile';
import { vehicleService } from '../service';
import { PagingSearch, VehicleProfileUpdate } from '../service/model/Request';
import * as C from '../App.constants';
import * as _ from 'lodash';
import { FormStatus } from '../service/model/CommonTypes';

export const fetchVehicle = createAsyncThunk('userVehicles/fetchVehicle',
  async (id:string) => vehicleService.getById(id)
);

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

export const SIDE_TABS_OFFSET = 1;

export const calculateOffset = (currentPick:number):number => {
  return currentPick - SIDE_TABS_OFFSET;
}

interface UserVehicleListState {
  currentPick: number
  currentVehicle: VehicleProfile
  vehicles: VehicleProfile[]
  keyword: string
  total: number
  page: number
  pageSize: number
  status: FormStatus
  error?: string | undefined
}

const initialState: UserVehicleListState = {
  currentPick: 0,
  keyword: '',
  total: 0,
  page: 0,
  pageSize: C.DEFAULT_PAGE_SIZE,
  vehicles: [],
  currentVehicle: blankVehicleProfile,
  status: C.IDLE,
  error: ''
};

export const userVehiclesSlice = createSlice({
  name: 'userVehicles',

  initialState,

  reducers: {
    changePick: (state, action) => {
      const index = action.payload;
      state.currentPick = index;
      if (index > 0) {
        state.currentVehicle = state.vehicles[calculateOffset(index)];
      }
    },
    setCurrentVehicle: (state, action) => {
      state.currentVehicle = action.payload;
    },
    setUserVehicles: (state, action) => {
      state.vehicles = action.payload;
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
    changeName: (state, action) => {
      state.currentVehicle!.name = action.payload;
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
      .addCase(fetchVehicle.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        syncToList(state, action);
      })
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
        state.status = C.LOADING;
      })
      .addCase(updateVehicle.fulfilled, (state,action) => {
        state.status = C.SUCCEEDED;
        syncToList(state, action);
      })
      .addCase(updateVehicle.rejected, (state) => {
        state.status = C.FAILED;
      })
      .addCase(saveNewVehicle.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(saveNewVehicle.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        if (action.payload.status === 201) {
          state.vehicles.push(action.payload.data);
        }
      })
      .addCase(saveNewVehicle.rejected, (state) => {
        state.status = C.FAILED;
      })
      .addCase(updateUserVehicleName.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        const index = calculateOffset(state.currentPick);
        const updatedVehicle = action.payload.data as VehicleProfile;
        if (action.payload.status === 202) {
          // update current vehicle modification date
          state.currentVehicle.modificationDate = updatedVehicle.modificationDate;
          // update the vehicle in the list
          state.vehicles[index].name = updatedVehicle.name;
          state.vehicles[index].modificationDate = updatedVehicle.modificationDate;
        }
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(deleteVehicle.fulfilled, (state) => {
        state.status = C.SUCCEEDED;
        const index = state.vehicles.findIndex(vehicle => vehicle.id === state.currentVehicle.id);
        state.vehicles.splice(index, 1);
        state.currentVehicle = blankVehicleProfile;
      })
      .addCase(deleteVehicle.rejected, (state) => {
        state.status = C.FAILED;
      });
  }
});

const syncToList = (state:UserVehicleListState, action:any) => {
  if (action.payload.status === 409) {
    state.status = C.FAILED;
  } else {
    state.status = C.SUCCEEDED;
    const vehicleProfile = action.payload;
    state.currentVehicle = vehicleProfile;
    const index = state.vehicles.findIndex(vehicle => vehicle.id === state.currentVehicle.id);
    if (index !== null) {
      state.vehicles[index] = vehicleProfile;
    }
  }
}

export const {
  changePick, setCurrentVehicle, setUserVehicles,
  setKeyword, clearKeyword, setPage, setPageSize, removeVehicleFromList,
  changeName, changeMake, changeModel, changeTrimLevel, changeModelYear, changeAccessScope,
  changeMediaGalleryId, changePricingMSRP,
  changeEngineType, changeEngineName, changeEngineFuelType, changeEngineHorsepower, changeEngineCode,
  changeEngineCylinder, changeEngineDisplacement, changeEngineTorque, changeEngineTorqueRpm, changeEngineHorsepowerRpm,
  changeTransmissionName, changeTransmissionType, changeTransmissionAvailability, changeTransmissionAutomaticType,
  changeTransmissionDrivetrain, changeTransmissionNumberOfSpeeds
} = userVehiclesSlice.actions;

export default userVehiclesSlice.reducer;
