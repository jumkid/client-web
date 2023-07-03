import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ActivityNotification from '../layout/MainLayout/model/ActivityNotification';
import { userService } from '../service';
import * as _ from 'lodash';
import * as C from '../App.constants';
import { FormStatus } from '../service/model/CommonTypes';

export const fetchUserActivityNotifications = createAsyncThunk('activityNotifications/fetch',
  async () => userService.getActivityNotifications()
);

interface NotificationState {
  activityNotifications: ActivityNotification[]
  count: number
  status: FormStatus
}

const initialState: NotificationState = {
  activityNotifications: [],
  count: 0,
  status: C.IDLE
}

export const userNotificationsSlice = createSlice({
  name: 'userNotifications',

  initialState,

  reducers: {
    readActivityNotification: (state, action) => {
      const activityNotification = state.activityNotifications
        .find(activityNotification => activityNotification.id === action.payload);
      if (!_.isNil(activityNotification)) {
        activityNotification.unread = false;
        userNotificationsSlice.caseReducers.reCalculateCount(state);
      }
    },
    removeActivityNotification: (state, action) => {
      const idx = state.activityNotifications
        .findIndex(activityNotification => activityNotification.id === action.payload);
      state.activityNotifications.splice(idx, 1);
      userNotificationsSlice.caseReducers.reCalculateCount(state);
    },
    reCalculateCount: (state) => {
      const unreadList = state.activityNotifications.filter(activityNotification => activityNotification.unread === true);
      state.count = unreadList?.length || 0;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActivityNotifications.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchUserActivityNotifications.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        state.activityNotifications = action.payload.data || [];
        userNotificationsSlice.caseReducers.reCalculateCount(state);
      })
      .addCase(fetchUserActivityNotifications.rejected, (state) => {
        state.status = C.FAILED;
      })
  }
});

export const { readActivityNotification, removeActivityNotification, reCalculateCount } = userNotificationsSlice.actions;

export default userNotificationsSlice.reducer;