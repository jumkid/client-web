import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VehicleProfile } from './model/VehicleProfile';
import { vehicleService } from '../service';
import { PagingSearch, VehicleProfileUpdate } from '../service/model/Request';

export const fetchUserVehicles = createAsyncThunk('userVehicles/fetchUserVehicles',
  async (pagingSearch:PagingSearch) => { return vehicleService.getByUser(pagingSearch); }
);

export const updateUserVehicleName = createAsyncThunk('userVehicles/updateName',
  async (vehicleUpdate:VehicleProfileUpdate) => { return vehicleService.updateName(vehicleUpdate.id, vehicleUpdate.vehicle); }
);

export const saveNewVehicle = createAsyncThunk('userVehicles/saveNew',
  async (vehicleProfile:VehicleProfile) => { return vehicleService.saveNew(vehicleProfile); }
);

export const deleteVehicle = createAsyncThunk('userVehicles/delete',
  async (id:string) => { return vehicleService.delete(id); }
);

interface UserVehicleListState {
  currentPick: number
  vehicles: VehicleProfile[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string | undefined
}

const initialState: UserVehicleListState = {
  currentPick: 1,
  vehicles: [],
  status: 'idle',
  error: ''
};

export const userVehiclesSlice = createSlice({
  name: 'userVehicles',

  initialState,

  reducers: {
    changePick: (state, action) => {
      state.currentPick = action.payload;
    },
    updateCurrentName: (state, action) => {
      // the first two index (0 and 1) of tabs are used for specific actions
      const index = state.currentPick - 2;
      state.vehicles[index].name = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload.data;
      })
      .addCase(fetchUserVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveNewVehicle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.status === 201) {
          state.vehicles.push(action.payload.data);
          state.currentPick = state.vehicles.length + 1; // jump to the new vehicle as current pick
        }
      })
      .addCase(updateUserVehicleName.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.status === 202) {
          // the first two index (0 and 1) of tabs are used for specific actions
          const index = state.currentPick - 2;
          state.vehicles[index] = action.payload.data;
        }
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.status === 204) {
          const index = state.currentPick - 2;
          state.currentPick = 1; // set to default current pick for all pick
          state.vehicles.splice(index, 1);
        }
      });
  }
});

export const { changePick, updateCurrentName } = userVehiclesSlice.actions;

export default userVehiclesSlice.reducer;
