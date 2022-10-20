import authenticationManager from '../Auth/AuthenticationManager';
import dataExchangeService from './DataExchangeService';
import * as C from '../App.constants';
import { UserProfile } from '../UserLogin/model/UserProfile';

export class AuthenticationService {
  async signUp (userProfile: UserProfile) {
    // re-assemble data for backend usage
    // confirmPassword, phone is not needed and should be removed
    const { password, confirmPassword, phone, ...data } = userProfile;
    data.credentials[0].value = password ? password : '';

    const response = await dataExchangeService.postWithPromise(C.USER_SIGNUP_API,
      data);
    return {
      isSuccess: response ? response.status === 201 : false,
      data: response ? response.data : null
    };
  }

  async login (username: string, password: string) {
    const response = await dataExchangeService.postWithPromise(C.USER_LOGIN_API,
      `${C.USERNAME}=${username}&${C.PASSWORD}=${password}`);

    let isLoggedIn = false;
    if (response && response.status === 200 && response.data) {
      authenticationManager.updateToken(response.data.access_token);
      isLoggedIn = true;
    }
    return { isLoggedIn, status: response ? response.status : null };
  }

  async refresh (refreshToken:string) {
    return await dataExchangeService
      .postWithPromise(C.USER_TOKEN_REFRESH_API, refreshToken);
  }
}

export default new AuthenticationService();
