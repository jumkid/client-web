import authenticationManager from '../Auth/AuthenticationManager';
import dataExchangeService from './DataExchangeService';

export class AuthenticationService {
  constructor () {
    this.baseUrl = '/v1/user/';
  }

  async login (username, password) {
    const _this = this;
    const result = await dataExchangeService.postWithPromise(_this.baseUrl + 'login', {
      username,
      password
    });
    if (result.status === 200) {
      authenticationManager.updateToken(result.data.accessToken);
      return result;
    }
  };

  async refresh (refreshToken) {
    const _this = this;
    return await dataExchangeService.postWithPromise(_this.baseUrl + 'refresh-token', refreshToken);
  }
}

export default new AuthenticationService();
