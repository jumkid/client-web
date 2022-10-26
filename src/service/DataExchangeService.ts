import axios, { AxiosResponse } from 'axios';
import * as U from '../App.utils';
import authenticationManager from '../security/Auth/AuthenticationManager';
import { APIResponse } from './model/Response';

const buildUrlWithParams = (url: string, params?: object | string) => {
  let _url = url;
  if (params !== null) {
    _url = url + ((params != null) ? '?' : '');
    if (typeof params === "string") {
      _url += params;
    } else {
      for (const param in params) {
        if (Object.prototype.hasOwnProperty.call(params, param)) {
          type ObjectKey = keyof typeof params
          const key = param as ObjectKey;
          _url += param + '=' + params[key];
        }
      }
    }
  }
  return _url;
};

type Callback = (data?:object | object[] | string) => void

export interface IDataExchangeService {
  get(url: string, params?: object, callback?: Callback):void
  post(url: string, params?: object, callback?: Callback):void
  getWithPromise(url: string, params?: object):Promise<APIResponse>
  postWithPromise (url: string, params?: object | string):Promise<APIResponse>
  putWithPromise(url: string, params?: object | string):Promise<APIResponse>
}

export class DataExchangeService implements IDataExchangeService {
  get (url: string, params: object | undefined, callback?:Callback): void {
    const _url = buildUrlWithParams(url, params);

    axios.get(_url).then(response => {
      (callback != null) && callback(JSON.parse(response.data));
    });
  }

  post (url: string, params?: object | string, callback?: Callback):void {
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    axios.post(url, params, conf).then(res => {
      (callback != null) && callback(res.data);
    });
  }

  async getWithPromise (url: string, params?: object | string):Promise<APIResponse> {
    const _url = buildUrlWithParams(url, params);
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    return await axios.get(_url, conf)
      .then(response => {
        return { status: response ? response.status : 500, data: response ? response.data : null };
      })
      .catch(error => {
        const response = error.response;
        this.if403Logout(response);
        return { status: response.status, data: response.data };
      });
  }

  async postWithPromise (url: string, params?: object | string):Promise<APIResponse> {
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    return await axios.post(url, params, conf)
      .then(response => {
        return { status: response ? response.status : 500, data: response ? response.data : null };
      })
      .catch(error => {
        const response = error.response;
        this.if403Logout(response);
        return { status: response ? response.status : 500, data: response ? response.data : null };
      });
  }

  async putWithPromise(url: string, params: object | string | undefined):Promise<APIResponse> {
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    return await axios.put(url, params, conf)
      .then(response => {
        return { status: response ? response.status : 500, data: response ? response.data : null };
      })
      .catch(error => {
        const response = error.response;
        this.if403Logout(response);
        return { status: response ? response.status : 500, data: response ? response.data : null };
      });
  }

  getConf(contentType:string):object {
    return {
      headers: {
        'Content-Type': contentType,
        Authorization: authenticationManager.isLoggedIn() ? `Bearer ${authenticationManager.getAccessToken()}` : null
      }
    }
  }

  getContentTypeByParams (params?: object | string):string {
    if (params) {
      if (params instanceof FormData && params.has('file') && params.get('file') instanceof File) {
        return 'multipart/form-data';
      } else
      if (U.isJson(params)) {
        return 'application/json';
      }
    }
    return 'application/x-www-form-urlencoded';
  }

  if403Logout(response:AxiosResponse):void {
    if (response && response.status === 403) {
      authenticationManager.logout();
      window.location.assign('/login');
    }
    return;
  }
}

export default new DataExchangeService();