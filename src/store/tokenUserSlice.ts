import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserProfile } from '../security/AuthUser/model/UserProfile';
import authenticationService from '../service/AuthenticationService';
import { APIResponse } from '../service/model/Response';
import { FormStatus } from '../service/model/CommonTypes';
import * as C from '../App.constants';

export const fetchUserProfile = createAsyncThunk('tokenUser/fetchUserProfile', async (userId:string) => {
  const response = await authenticationService.getUser(userId);
  return (response && response.isSuccess) ? response.data : {};
});

export const submitAvatarUpdate = createAsyncThunk('tokenUser/submitAvatarUpdate',
  async (tokenUser:UserProfileState):Promise<APIResponse<any>> => {
    return await authenticationService.updateUser(tokenUser.userId, { attributes: tokenUser.userProfile.attributes });
  });

export const submitUserProfile = createAsyncThunk('tokenUser/submitUserProfile',
  async (tokenUser:UserProfileState):Promise<APIResponse<any>> => {
    return await authenticationService.updateUser(tokenUser.userId, tokenUser.userProfile);
  });

export interface UserProfileState {
  userId: string
  userProfile: UserProfile
  status: FormStatus
}

const initialState: UserProfileState = {
  userId: '',
  userProfile: {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    attributes: {
      avatar: ['']
    }
  },
  status: C.IDLE
}

export const tokenUserSlice = createSlice({
  name: "tokenUser",

  initialState,

  reducers: {
    setUserId: ((state, action) => {
      state.userId = action.payload
    }),
    updateUserProfile: ((state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload }
    }),
    updateAvatar: (state, action) => {
      state.userProfile.attributes = { avatar: [action.payload] };
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    }
  },

  extraReducers (builder) {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = C.LOADING;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = C.SUCCEEDED;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.status = C.FAILED;
      });
  }
});

export const { setUserId, updateUserProfile, updateAvatar, setStatus } = tokenUserSlice.actions;

export default tokenUserSlice.reducer;
