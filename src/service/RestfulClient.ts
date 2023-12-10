import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as U from '../App.utils';
import authenticationManager from '../security/Auth/AuthenticationManager';
import { APIPagingResponse, APIResponse, APIResponseWithHeaders } from './model/Response';
import * as _ from 'lodash';

type Callback = (data?:any) => void

export interface IRestfulClient {
  get(url: string, params?: string | object, callback?: Callback):void
  post(url: string, params?: object, callback?: Callback):void
  getWithPromise(url: string, params?: string | object | object[]):Promise<APIResponse<any>>
  getBase64WithPromise(url: string, params?: string | object | object[]):Promise<APIResponse<any>>
  postWithPromise(url: string, params: object | string | null, body?: string | object | object[]):Promise<APIResponse<any>>
  postWithPaging (url: string, params: object | string | null, body?: string | object | object[]):Promise<APIPagingResponse<any>>
  putWithPromise(url: string, params?: object | string):Promise<APIResponse<object>>
  deleteWithPromise(url:string, params?: object | string | null):Promise<APIResponse<any>>
  upload(url:string, formData:FormData, setProgress?:(progress:any) => void):Promise<APIResponse<any>>
  download(url:string, fileName:string | undefined):void
}

/**
 * Single instance of restful client which uses axios library for handling http calls
 */
export class RestfulClient implements IRestfulClient {

  async upload(url: string, formData: FormData, setProgress?:(progress:any) => void ): Promise<APIResponse<any>> {
    const { headers } = this.getConf('');

    try {
      const response = await axios.post(url, formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          progressEvent?.total && setProgress && setProgress(() =>
            Math.round((progressEvent.loaded / progressEvent.total!) * 100)
          );
        }
      });
      return {
        status: response ? response.status : 500,
        data: response ? response.data : null
      };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        status: e.response?.status,
        data: e.response?.data || {}
      };
    }
  }

  download(url: string, fileName:string | undefined): void {
    axios.get(url, {...this.getConf('application/octet-stream'), responseType: 'blob'})
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'unknown';
        document.body.appendChild(link);
        link.click();
      });
  }

  get(url: string, params: string | object, callback?:Callback): void {
    const _url = this.buildUrlWithParams(url, params);

    axios.get(_url).then(response => {
      (callback != null) && callback(JSON.parse(response.data));
    });
  }

  post(url: string, params?: object | string, callback?: Callback): void {
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    axios.post(url, params, conf).then(res => {
      (callback != null) && callback(res.data);
    });
  }

  async getBase64WithPromise(url: string, params?: string | object | object[] | undefined): Promise<APIResponseWithHeaders<any>> {
    const contentType = this.getContentTypeByParams(params);
    try {
      const response = await axios.get(url, {
        params,
        responseType: 'arraybuffer',
        ...this.getConf(contentType)
      });
      return {
        status: response ? response.status : 500,
        headers: response.headers,
        data: response.data
      };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        status: e.response?.status,
        headers: e.response?.headers,
        data: null
      };
    }
  }

  async getWithPromise(url: string, params?: string | object | object[],):Promise<APIResponse<any>> {
    const contentType = this.getContentTypeByParams(params);
    const conf = { params: params, ...this.getConf(contentType) };
    try {
      const response = await axios.get(url, conf);
      return {
        status: response ? response.status : 500,
        data: response.data
      };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        status: e.response?.status,
        data: e.response?.data || {}
      };
    }
  }

  async postWithPromise(
    url: string,
    params: string | object | object[] | null,
    body?: string | object | object[]
  ):Promise<APIResponse<any>> {
    const contentType = this.getContentTypeByParams(body);
    const conf = { params, ...this.getConf(contentType)};
    try {
      const response = await axios.post(url, body, conf);
      return { status: response ? response.status : 500, data: response ? response.data : null };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        status: e.response?.status,
        data: e.response?.data || {}
      };
    }
  }

  async postWithPaging(
    url: string,
    params: string | object | object[] | null,
    body?: string | object | object[]
  ):Promise<APIPagingResponse<any>> {
    const contentType = this.getContentTypeByParams(body);
    const conf = { params, ...this.getConf(contentType)};
    try {
      const response = await axios.post(url, body, conf);
      const data = response.data;
      return {
        success: response.status === 200,
        msg: data.msg,
        total: data.total,
        size: data.size,
        page: data.page,
        data: data.data
      };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        success: false,
        msg: e.response?.status,
        total: 0,
        size: 0,
        page: 0,
        data: e.response.data || {}
      };
    }
  }

  async putWithPromise(url: string, params?: object | string):Promise<APIResponse<any>> {
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    try {
      const response = await axios.put(url, params, conf);
      return {
        status: response ? response.status : 500,
        data: response ? response.data : null
      };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        status: e.response?.status,
        data: e.response?.data || {}
      };
    }
  }

  async deleteWithPromise(url:string, params?: object | string | null):Promise<APIResponse<any>> {
    const contentType = this.getContentTypeByParams(params);
    const conf = this.getConf(contentType);
    try {
      const response = await axios.delete(url, {...conf, data: params});
      return {
        status: response ? response.status : 500,
        data: response ? response.data : null
      };
    } catch (e:any) {
      this.if403Logout(e.response);
      return {
        status: e.response?.status,
        data: e.response?.data || {}
      };
    }
  }

  getConf(contentType:string):AxiosRequestConfig {
    return {
      headers: {
        'Content-Type': contentType,
        Authorization: authenticationManager.isLoggedIn() ? `Bearer ${authenticationManager.getAccessToken()}` : null
      }
    }
  }

  getContentTypeByParams(params?: string | object | object[] | null):string {
    if (!_.isNil(params) && params instanceof FormData) {
      return 'multipart/form-data';
    } else if (!_.isNil(params) && U.isJson(params)) {
      return 'application/json';
    }
    return 'application/x-www-form-urlencoded';
  }

  if403Logout(response:AxiosResponse):boolean {
    if (response && response.status === 403) {
      authenticationManager.logout();
      window.location.assign('/login');
      return true;
    }
    return false;
  }

  buildUrlWithParams(url: string, params?: string | object | object[] | null ): string {
    if (_.isNil(params)) { return url; }

    url += (params ? '?' : '');
    if ( Array.isArray(params)) {
      for (let i=0;i<params.length;i++) {
        url += this.buildUrlWithObject(params[i]) + (i < params.length-1 ? '&' : '');
      }
    } else if (typeof params === "string") {
      url += params;
    } else if (typeof params === "object") {
      url += this.buildUrlWithObject(params);
    }

    return url;
  }

  buildUrlWithObject(param:object): string {
    let paramStr = '';
    for (const [key, val] of Object.entries(param)) {
      paramStr += `${key}=${val}&`;
    }
    return paramStr.substring(0, paramStr.length-1); // remove the last & character
  }
}

export default new RestfulClient();
