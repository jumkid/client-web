import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserProfile } from '../security/AuthUser/model/UserProfile';
import authenticationService from '../service/AuthenticationService';
import { APIResponse } from '../service/model/Response';

export const fetchUserProfile = createAsyncThunk('tokenUser/fetchUserProfile', async (userId:string) => {
  const response = await authenticationService.getUser(userId);
  return (response && response.isSuccess) ? response.data : {};
});

export const submitAvatarUpdate = createAsyncThunk('tokenUser/submitAvatarUpdate', async (tokenUser:UserProfileState):Promise<APIResponse>=> {
  console.log('update user avatar');
  return await authenticationService.updateUser(tokenUser.userId, { attributes: tokenUser.userProfile.attributes });
});

export const submitUserProfile = createAsyncThunk('tokenUser/submitUserProfile', async (tokenUser:UserProfileState):Promise<APIResponse> => {
  console.log('update user profile');
  return await authenticationService.updateUser(tokenUser.userId, tokenUser.userProfile);
});

export interface UserProfileState {
  userId: string
  userProfile: UserProfile
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
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
  status: 'idle'
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
    }
  },

  extraReducers (builder) {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const { setUserId, updateUserProfile, updateAvatar } = tokenUserSlice.actions;

export default tokenUserSlice.reducer;
