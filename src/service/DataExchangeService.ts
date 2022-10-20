import axios from 'axios';
import * as U from '../App.utils';
import authenticationManager from '../Auth/AuthenticationManager';
import APIResponse from './model/APIResponse';

const buildUrlWithParams = (url: string, params: object | null) => {
  let _url = url + ((params != null) ? '?' : '');
  for (const param in params) {
    if (Object.prototype.hasOwnProperty.call(params, param)) {
      type ObjectKey = keyof typeof params
      const key = param as ObjectKey;
      _url += param + '=' + params[key];
    }
  }
  return _url;
};

export class DataExchangeService {
  get (url: string, params: object | null, callback: (data:any) => {} | null): void {
    const _url = buildUrlWithParams(url, params);

    axios.get(_url).then(response => {
      (callback != null) && callback(JSON.parse(response.data));
    });
  }

  async getWithPromise (url: string, params: object | null) {
    const _url = buildUrlWithParams(url, params);
    const conf = {
      headers: {
        Authorization: authenticationManager.isLoggedIn() ? `Bearer ${authenticationManager.getAccessToken()}` : null
      }
    };
    try {
      return await axios.get(_url, conf);
    } catch (error: any) {
      console.error(`failed to do get with promise: ${error}`);
      if (error.response && error.response.status === 403) {
        authenticationManager.logout();
      }
    }
  }

  post (url: string, params: object | null, callback: Function | null):void {
    const contentType = this.getContentTypeByParams(params);
    const conf = {
      headers: {
        'Content-Type': contentType
      }
    };
    axios.post(url, params, conf).then(res => {
      (callback != null) && callback(res.data);
    });
  }

  async postWithPromise (url: string, params: object | string | null):Promise<APIResponse> {
    const contentType = this.getContentTypeByParams(params);
    const conf = {
      headers: {
        'Content-Type': contentType,
        Authorization: authenticationManager.isLoggedIn() ? `Bearer ${authenticationManager.getAccessToken()}` : null
      }
    };
    return await axios.post(url, params, conf)
      .catch(error => {
        const response = error.response;
        if (response && response.status === 403) {
          authenticationManager.logout();
        }
        return { status: response ? response.status : 500, data: response ? response.data : null };
      });
  }

  getContentTypeByParams (params: object | string | null):string {
    if (params && U.isJson(params)) {
      return 'application/json';
    } else {
      return 'application/x-www-form-urlencoded';
    }
  }
}

export default new DataExchangeService();
