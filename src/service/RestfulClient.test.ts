import restfulClient from './RestfulClient';
import mockAxios from 'axios';

describe('RestfulClient', () => {
  let baseUrl = 'http://localhost:8080/api';

  beforeAll(() => {
    jest.mock('axios');
  });

  it('Should build url with string param', () => {
    const param = "id=1&name=test";
    const _url = restfulClient.buildUrlWithParams(baseUrl, param);
    expect(_url).toBe(baseUrl + '?' + param);
  });

  it('Should build url with object param', () => {
    const param = {id:1, name:'test', values:[1,2,3,4,5]};
    const _url = restfulClient.buildUrlWithParams(baseUrl, param);
    expect(_url).toBe(baseUrl + '?id=1&name=test&values=1,2,3,4,5');
  });

  it('Should build url with array param', () => {
    const param = [{id:1, name:'hello'}, {id:2, name:"world"}];
    const _url = restfulClient.buildUrlWithParams(baseUrl, param);
    expect(_url).toBe(baseUrl + '?id=1&name=hello&id=2&name=world');
  });

  it('Should make get request', () => {
    mockAxios.get = jest.fn().mockResolvedValue({status: 200, data: JSON.stringify({success:true})});

    const param = "id=1";
    let isSuccess = false;

    restfulClient.get(baseUrl, param, (data) => {
      ({success: isSuccess} = data!);
      expect(isSuccess).toBeTruthy();
    });
  })
});