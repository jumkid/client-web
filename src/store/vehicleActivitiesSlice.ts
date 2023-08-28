import { Activity, ContentResource, Priority } from './model/Activity';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { activityService } from '../service';
import { FormStatus } from '../service/model/CommonTypes';
import * as C from '../App.constants';

export const fetchVehicleActivities = createAsyncThunk('vehicleActivities/fetch',
  async (entityId: string) => activityService.getByEntityId(entityId)
);

export const fetchActivity = createAsyncThunk('vehicleActivity/fetch',
  async (activityId:number) => activityService.getById(activityId)
);

export const fetchActivityStatuses = createAsyncThunk('activityStatuses/fetch',
  async () => activityService.getActivityStatuses()
);

export const fetchActivityPriorities = createAsyncThunk('activityPriorities/fetch',
  async () => activityService.getActivityPriorities()
);

export const saveNew = createAsyncThunk('vehicleActivity/new',
  async (activity:Activity, {rejectWithValue}) => {
    try {
      return await activityService.saveNewActivity(activity);
    } catch (e:any) {
      if (!e.response) { throw e; }
      return rejectWithValue(e.response.data.details);
    }
  }
);

export const saveUpdate = createAsyncThunk('vehicleActivity/update',
  async (activity:Activity) => activityService.updateActivity(activity)
);

export const deleteActivity = createAsyncThunk('vehicleActivity/delete',
  async (activityId:number) => activityService.deleteActivity(activityId)
);

export const saveActivityContent = createAsyncThunk('vehicleActivity/content/update',
  async (contentResource: ContentResource) => activityService.saveActivityContent(contentResource)
);

export const deleteActivityContent = createAsyncThunk('vehicleActivity/content/delete',
  async (id:number) => activityService.deleteActivityContent(id)
);

type VehicleActivitiesState = {
  currentActivity: Activity
  activities: Activity[] | null
  activityPriorities: Priority[] | null
  activityStatuses: string[] | null
  status: FormStatus
};

const currentTime = new Date();

const initialState: VehicleActivitiesState = {
  currentActivity: {
    id: 0,
    name: "",
    status: "",
    priority: { identifier:"", label:"" },
    startDate: new Date(currentTime.setHours(currentTime.getHours() + 1)).toISOString(),
    endDate: null,
    autoNotify: true,
    description: "",
    activityEntityLinks: []
  },
  activities: [],
  activityPriorities: [],
  activityStatuses: [],
  status: C.IDLE
};

export const vehicleActivitiesSlice = createSlice({

  name: "vehicleActivities",

  initialState,

  reducers: {
    changeName: (state, action) => {
      state.currentActivity.name = action.payload;
    },
    changeStartDate: (state, action) => {
      state.currentActivity.startDate = action.payload
    },
    changeEndDate: (state, action) => {
      state.currentActivity.endDate = action.payload
    },
    changeStatus: (state, action) => {
      state.currentActivity.status = action.payload;
    },
    changePriority: (state, action) => {
      state.currentActivity.priority = action.payload;
    },
    changeDescription: (state, action) => {
      state.currentActivity.description = action.payload;
    },
    changeContentResources: (state, action) => {
      state.currentActivity.contentResources = action.payload;
    },
    resetCurrentActivity: (state, action) => {
      state.currentActivity = {
        ...initialState.currentActivity,
        activityEntityLinks:[{entityId:action.payload, entityName: "vehicle"}]
      };
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleActivities.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchVehicleActivities.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        state.activities = action.payload.data;
      })
      .addCase(fetchVehicleActivities.rejected, (state) => {
        state.status = C.FAILED;
      })
      .addCase(fetchActivity.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        const data = action.payload.data;
        if (data != null) {
          state.currentActivity = data;
        }
      })
      .addCase(fetchActivity.rejected, (state) => {
        state.status = C.FAILED;
      })
      .addCase(fetchActivityPriorities.fulfilled, (state, action) => {
        state.activityPriorities = action.payload.data;
      })
      .addCase(fetchActivityStatuses.fulfilled, (state, action) => {
        state.activityStatuses = action.payload.data;
      })
  }

});

export const {
  changeName,
  changeStatus,
  changePriority,
  changeStartDate,
  changeEndDate,
  changeDescription,
  changeContentResources,
  resetCurrentActivity
} = vehicleActivitiesSlice.actions;

export default vehicleActivitiesSlice.reducer;
