import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VehicleProfile } from './model/VehicleProfile';
import { vehicleService } from '../service';
import { PagingSearch, VehicleProfileUpdate } from '../service/model/Request';
import * as C from '../App.constants';

export const fetchUserVehicles = createAsyncThunk('userVehicles/fetchUserVehicles',
  async (pagingSearch:PagingSearch) => { return vehicleService.getByUser(pagingSearch); }
);

export const updateUserVehicleName = createAsyncThunk('userVehicles/updateName',
  async (vehicleUpdate:VehicleProfileUpdate) => { return vehicleService.updateName(vehicleUpdate.id, vehicleUpdate.vehicle); }
);

export const saveNewVehicle = createAsyncThunk('userVehicles/saveNew',
  async (vehicleProfile:VehicleProfile) => { return vehicleService.saveAsNew(vehicleProfile); }
);

export const deleteVehicle = createAsyncThunk('userVehicles/delete',
  async (id:string) => { return vehicleService.delete(id); }
);

interface UserVehicleListState {
  currentPick: number
  keyword: string
  total: number
  page: number
  pageSize: number
  vehicles: VehicleProfile[]
  currentVehicle: VehicleProfile | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
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
  status: 'idle',
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload.data;
        state.total = action.payload.total;
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

export const { changePick, setKeyword, clearKeyword, setPage, setPageSize } = userVehiclesSlice.actions;

export default userVehiclesSlice.reducer;
