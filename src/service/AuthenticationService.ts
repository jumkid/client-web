import authenticationManager from '../security/Auth/AuthenticationManager';
import dataExchangeService from './DataExchangeService';
import * as C from '../App.constants';
import { UserProfile } from '../security/AuthUser/model/UserProfile';
import { AuthResponse } from './model/Response';

interface IAuthenticationService {
  getUser(userId:string):Promise<AuthResponse>
  signUp (userProfile: UserProfile):Promise<AuthResponse>
  updateUser (userId:string, userProfile: UserProfile):Promise<AuthResponse>
  resetPassword (userId:string, newPassword:string):Promise<AuthResponse>
  login (username:string, password?:string):Promise<AuthResponse>
  refresh (refreshToken:string):Promise<AuthResponse>
}

export class AuthenticationService implements IAuthenticationService{
  async getUser (userId:string) {
    const response = await dataExchangeService.getWithPromise(`${C.USER_API}/${userId}`);
    return {
      isSuccess: response ? response.status === 200 : false,
      status: response.status,
      data: response ? response.data : null
    }
  }

  async signUp (userProfile: UserProfile) {
    // re-assemble data for backend usage
    // confirmPassword, phone is not needed and should be removed
    const { password, confirmPassword, phone, ...data } = userProfile;
    data.credentials![0].value = password ? password : '';

    const response = await dataExchangeService.postWithPromise(C.USER_SIGNUP_API, null, data);
    return {
      isSuccess: response ? response.status === 201 : false,
      status: response.status,
      data: response ? response.data : null
    };
  }

  async updateUser (userId:string, userProfile: UserProfile) {
    const { username, email, firstName, lastName, attributes } = userProfile;
    const data = { username, email, firstName, lastName, attributes };

    const response = await dataExchangeService.putWithPromise(`${C.USER_API}/${userId}`, data);
    return {
      isSuccess: response ? response.status === 204: false,
      status: response.status,
      data: response ? response.data : null
    };
  }

  async resetPassword (userId:string, newPassword:string) {
    const data = { credentials: [{ type: "password", value: newPassword }]};
    const response = await dataExchangeService.putWithPromise(`${C.USER_API}/${userId}`, data);
    return {
      isSuccess: response ? response.status === 204: false,
      status: response.status,
      data: response ? response.data : null
    };
  }

  async login (username?:string, password?:string) {
    let isSuccess = false;
    const body = `${C.USERNAME}=${username}&${C.PASSWORD}=${password}`;
    const response = await dataExchangeService.postWithPromise(C.USER_LOGIN_API, null, body);
    if (response && response.status === 200 && response.data) {
      authenticationManager.updateToken(response.data.access_token);
      isSuccess = true;
    }
    return { isSuccess, status: response.status, data: null };
  }

  async refresh (refreshToken:string) {
    const response = await dataExchangeService
      .postWithPromise(C.USER_TOKEN_REFRESH_API, refreshToken);
    return {
      isSuccess: response ? response.status === 204: false,
      status: response.status,
      data: response ? response.data : null
    }
  }
}

export default new AuthenticationService();
