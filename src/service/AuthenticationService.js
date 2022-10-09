import authenticationManager from '../Auth/AuthenticationManager';
import dataExchangeService from './DataExchangeService';

export class AuthenticationService {
  constructor () {
    this.apiUrl = 'http://localhost/v1/user/';
  }

  async login (username, password) {
    const _this = this;
    const response = await dataExchangeService.postWithPromise(_this.apiUrl + 'login', `username=${username}&password=${password}`);
    if (response.status === 200) {
      console.log(`got access token ${response.data.access_token}`);
      authenticationManager.updateToken(response.data.access_token);
      return true;
    } else {
      return false;
    }
  };

  async refresh (refreshToken) {
    const _this = this;
    return await dataExchangeService.postWithPromise(_this.apiUrl + 'refresh-token', refreshToken);
  }
}

export default new AuthenticationService();
