import axios from 'axios';

const buildUrlWithParams = (url, params) => {
  let _url = url + (params ? '?' : '');
  for (const param in params) {
    _url += param + '=' + params[param];
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
      console.error('Data exchange error: ' + err.message);
    });
  };

  async getWithPromise (url, params) {
    const _url = buildUrlWithParams(url, params);
    try {
      return await axios.get(_url);
    } catch (error) {
      console.error('failed to do get with promise: ' + error);
    }
  };

  async postWithPromise (url, params) {
    const _headers = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const result = await axios.post(url, JSON.stringify(params), _headers);
    if (result.status === 200) {
      return result;
    }
  }
}

export default new DataExchangeService();
