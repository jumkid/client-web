import authenticationManager from '../Auth/AuthenticationManager';
import dataExchangeService from './DataExchangeService';
import C from '../App.constants';

export class AuthenticationService {
  async signUp (userProfile) {
    console.log(userProfile);
    const { status, data } = await dataExchangeService.postWithPromise(C.USER_SIGNUP_API,
      userProfile);
    return { isSuccess: (status === 201), data };
  }

  async login (username, password) {
    const response = await dataExchangeService.postWithPromise(C.USER_LOGIN_API,
      `${C.USERNAME}=${username}&${C.PASSWORD}=${password}`);
    let isLoggedIn = false;
    if (response.status === 200) {
      authenticationManager.updateToken(response.data.access_token);
      isLoggedIn = true;
    }
    return { isLoggedIn, status: response.status };
  };

  async refresh (refreshToken) {
    return await dataExchangeService
      .postWithPromise(C.USER_TOKEN_REFRESH_API, refreshToken);
  }
}

export default new AuthenticationService();
