import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { VehicleFieldValuePair } from '../service/VehicleService';
import { blankVehicleProfile, VehicleProfile } from './model/VehicleProfile';
import { PagingSearch } from '../service/model/Request';
import { vehicleService } from '../service';
import { FormStatus } from '../service/model/CommonTypes';
import * as C from '../App.constants';

interface SearchVehiclesState {
  status: FormStatus
  target: string
  vinVehicle: VehicleProfile
  searchKeyword: string
  searchVehicles: VehicleProfile[]
  searchTotal: number
  searchPage: number
  searchPageSize: number
  matchSelections: {
    makers: string[]
    models: string[]
    modelYears: string[]
    trimLevels: string[]
  }
  matchFields: VehicleFieldValuePair[]
  matchVehicles: VehicleProfile[]
}

const initialState:SearchVehiclesState = {
  status: C.IDLE,
  target: C.MAKE,
  vinVehicle: blankVehicleProfile,
  searchKeyword: '',
  searchVehicles: [],
  searchTotal: 0,
  searchPage: 0,
  searchPageSize: C.DEFAULT_PAGE_SIZE,
  matchSelections: {
    makers: [],
    models: [],
    modelYears: [],
    trimLevels: []
  },
  matchFields: [],
  matchVehicles: []
}

export const fetchVehicleByVin = createAsyncThunk('searchVehicles/fetchByVin',
  async (vin:string) => { return vehicleService.getByVin(vin); }
);

export const fetchMatchVehicles = createAsyncThunk('searchVehicles/fetchMatchVehicles',
  async (pagingSearch:PagingSearch) => { return vehicleService.getByMatchers(pagingSearch); }
);

export const fetchSearchVehicles = createAsyncThunk('searchVehicles/fetchSearchVehicles',
  async (pagingSearch:PagingSearch) => { return vehicleService.getByPublic(pagingSearch); }
);

export const searchVehiclesSlice = createSlice({
  name: "searchVehicles",

  initialState,

  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    changeMatchSelections: (state, action) => {
      state.matchSelections = { ...state.matchSelections , ...action.payload}
    },
    setMatchFields: (state, action) => {
      const matchField: VehicleFieldValuePair = action.payload;
      const target = matchField.field;
      let retainMatchFields:VehicleFieldValuePair[] = [];
      if (target === C.MODEL) {
        retainMatchFields = state.matchFields.filter(m => m.field === C.MAKE);
        state.matchSelections = {...initialState.matchSelections,
          makers: state.matchSelections.makers, models: state.matchSelections.models};
      } else if (target === C.MODEL_YEAR) {
        retainMatchFields = state.matchFields.filter(matchField => matchField.field === C.MAKE
          || matchField.field === C.MODEL);
        state.matchSelections = {...initialState.matchSelections,
          makers: state.matchSelections.makers, models: state.matchSelections.models,
          modelYears: state.matchSelections.modelYears};
      } else if (target === C.TRIM_LEVEL) {
        retainMatchFields = state.matchFields.filter(matchField => matchField.field === C.MAKE
          || matchField.field === C.MODEL || matchField.field === C.MODEL_YEAR);
      }
      retainMatchFields.push(matchField);
      state.matchFields = retainMatchFields;
    },
    clearMatchFields: (state) => {
      state.matchFields = [];
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    clearSearchKeyword: (state) => {
      state.searchKeyword = '';
      state.searchVehicles = [];
      state.searchPage = 0;
      state.searchTotal = 0;
    },
    setSearchPageSize: (state, action) => {
      state.searchPageSize = action.payload;
    },
    setSearchPage: (state, action) => {
      state.searchPage = action.payload;
    },
    setVinVehicle: (state, action) => {
      state.vinVehicle = action.payload;
    },
    setMatchVehicles: (state, action) => {
      state.matchVehicles = action.payload
    },
    setTarget: (state, action) => {
      state.target = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleByVin.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchVehicleByVin.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        state.vinVehicle = action.payload.data;
        // state.vinVehicle = U.vinVehicleToFieldValuePairs(action.payload.data);
      })
      .addCase(fetchMatchVehicles.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchMatchVehicles.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;

        state.matchVehicles = action.payload.data;
      })
      .addCase(fetchSearchVehicles.pending, (state) => {
        state.status = C.LOADING;

      })
      .addCase(fetchSearchVehicles.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        state.searchVehicles = action.payload.data;
        state.searchTotal = action.payload.total;
      })
  }

});

export const {
  setStatus,
  changeMatchSelections,
  setMatchFields,
  clearMatchFields,
  setSearchKeyword,
  clearSearchKeyword,
  setSearchPage,
  setSearchPageSize,
  setVinVehicle,
  setMatchVehicles,
  setTarget
} = searchVehiclesSlice.actions;

export default searchVehiclesSlice.reducer;
