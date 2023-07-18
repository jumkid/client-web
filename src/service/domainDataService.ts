import { DomainData } from '../store/model/DomainData';
import { APIResponse } from './model/Response';
import * as C from '../App.constants';
import restfulClient from './RestfulClient';

export interface IDomainDataService {
  getDomainData(industry:string, name:string):Promise<APIResponse<DomainData[]>>
}

class DomainDataService implements IDomainDataService {
  async getDomainData (industry: string, name: string): Promise<APIResponse<DomainData[]>> {
    const params = {industry, name};
    return await restfulClient.getWithPromise(C.DOMAIN_DATA_API, params);
  }

}

export default DomainDataService;