import authenticationManager from '../Auth/AuthenticationManager';
import dataExchangeService from './DataExchangeService';
import C from '../App.constants';

export class AuthenticationService {
  constructor () {
    this.apiUrl = process.env.REACT_APP_API_GATEWAY_HOST;
  }

  async signUp (userProfile) {
    console.log(userProfile);
    const { status, data } = await dataExchangeService.postWithPromise(this.apiUrl + process.env.REACT_APP_USER_SIGNUP_API,
      userProfile);
    return { isSuccess: (status === 201), data };
  }

  async login (username, password) {
    const response = await dataExchangeService.postWithPromise(this.apiUrl + process.env.REACT_APP_USER_LOGIN_API,
      `${C.USERNAME}=${username}&${C.PASSWORD}=${password}`);
    if (response.status === 200) {
      authenticationManager.updateToken(response.data.access_token);
      return true;
    } else {
      return false;
    }
  };

  async refresh (refreshToken) {
    const _this = this;
    return await dataExchangeService
      .postWithPromise(_this.apiUrl + process.env.REACT_APP_USER_TOKEN_REFRESH_API, refreshToken);
  }
}

export default new AuthenticationService();
