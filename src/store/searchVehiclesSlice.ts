import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { VehicleFieldValuePair } from '../service/VehicleService';
import * as _ from 'lodash';
import * as C from '../App.constants';
import { VehicleProfile } from './model/VehicleProfile';
import { PagingSearch } from '../service/model/Request';
import { vehicleService } from '../service';

interface SearchVehiclesState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
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
  status: 'idle',
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
    changeMatchSelections: (state, action) => {
      state.matchSelections = { ...state.matchSelections , ...action.payload}
    },
    setMatchFields: (state, action) => {
      const matchField: VehicleFieldValuePair = action.payload;
      const field = matchField.field, value = matchField.value;
      state.matchFields = _.unionWith([{field: field, value: value}], state.matchFields,
        (el1,el2) => {return el1.field === el2.field;});
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
    setMatchVehicles: (state, action) => {
      state.matchVehicles = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchVehicles.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMatchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matchVehicles = action.payload.data.data;
      })
      .addCase(fetchSearchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSearchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchVehicles = action.payload.data;
        state.searchTotal = action.payload.total;
      })
  }

});

export const {
  changeMatchSelections,
  setMatchFields,
  setSearchKeyword,
  clearSearchKeyword,
  setSearchPage,
  setSearchPageSize
} = searchVehiclesSlice.actions;

export default searchVehiclesSlice.reducer;
