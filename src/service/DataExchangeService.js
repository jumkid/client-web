import axios from 'axios';
import { isJson } from '../App.utils';
import authenticationManager from '../Auth/AuthenticationManager';

const buildUrlWithParams = (url, params) => {
  let _url = url + (params ? '?' : '');
  for (const param in params) {
    if (Object.prototype.hasOwnProperty.call(params, param)) {
      _url += param + '=' + params[param];
    }
  }
  return _url;
};

export class DataExchangeService {
  get (url, params, callback) {
    const _url = buildUrlWithParams(url, params);

    axios.get(_url, (response) => {
      let data = '';

      // A chunk of data has been received.
      response.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      response.on('end', () => {
        callback(JSON.parse(data));
      });
    }).on('error', (err) => {
      console.error(`Data exchange error: ${err.message}`);
    });
  };

  async getWithPromise (url, params) {
    const _url = buildUrlWithParams(url, params);
    const conf = {
      headers: {
        Authorization: authenticationManager.isLoggedIn() ? `Bearer ${authenticationManager.getAccessToken()}` : null
      }
    };
    try {
      return await axios.get(_url, conf);
    } catch (error) {
      console.error(`failed to do get with promise: ${error}`);
    }
  };

  post (url, params, callback) {
    const contentType = this.#getContentTypeByParams(params);
    const conf = {
      headers: {
        'Content-Type': contentType
      }
    };
    axios.post(url, params, conf).then(res => {
      return callback(res.data);
    });
  };

  async postWithPromise (url, params) {
    const contentType = this.#getContentTypeByParams(params);
    const conf = {
      headers: {
        'Content-Type': contentType,
        Authorization: authenticationManager.isLoggedIn() ? `Bearer ${authenticationManager.getAccessToken()}` : null
      }
    };
    return await axios.post(url, params, conf)
      .catch(error => {
        const response = error.response;
        return { status: response ? response.status : '500', data: response ? response.data : null };
      });
  };

  #getContentTypeByParams (params) {
    if (isJson(params)) {
      params = JSON.stringify(params);
      return 'application/json';
    } else {
      return 'application/x-www-form-urlencoded';
    }
  };
}

export default new DataExchangeService();
