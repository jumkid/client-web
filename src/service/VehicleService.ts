import * as C from '../App.constants';
import restfulClient from './RestfulClient';
import { APIPagingResponse, APIResponse } from './model/Response';
import { PagingSearch } from './model/Request';
import { VehicleProfile } from '../store/model/VehicleProfile';
import { DEFAULT_PAGE_SIZE } from '../App.constants';

export interface VehicleFieldValuePair {
  field:string
  value:string
}

export interface IVehicleService {
  getByUser: (pagingSearch:PagingSearch) => Promise<APIPagingResponse>
  getByPublic: (pagingSearch:PagingSearch) => Promise<APIPagingResponse>
  getByMatchers: (pagingSearch:PagingSearch) => Promise<APIResponse<any>>
  getByVin: (vin:string) => Promise<APIResponse<any>>
  getForAggregation: (field:string, matchFields:VehicleFieldValuePair[]) => Promise<APIResponse<any>>
  updateName: (id:string, vehicleProfile:VehicleProfile) => Promise<APIResponse<any>>
}

class VehicleService implements IVehicleService {
  async getByUser (pagingSearch:PagingSearch): Promise<APIPagingResponse> {
    VehicleService.normalizePagingSearch(pagingSearch);
    const response = await restfulClient.getWithPromise(C.VEHICLES_SEARCH_API, pagingSearch);
    return response.data;
  }

  async getByPublic (pagingSearch:PagingSearch): Promise<APIPagingResponse> {
    VehicleService.normalizePagingSearch(pagingSearch);
    const response = await restfulClient.getWithPromise(C.VEHICLES_PUBLIC_SEARCH_API, pagingSearch);
    return response.data;
  }

  async getByMatchers (pagingSearch:PagingSearch): Promise<APIResponse<any>> {
    VehicleService.normalizePagingSearch(pagingSearch);
    return await restfulClient.postWithPromise(C.VEHICLES_MATCHERS_SEARCH_API, pagingSearch, pagingSearch.data);
  }

  async getForAggregation (field: string, matchFields: VehicleFieldValuePair[]): Promise<APIResponse<any>> {
    return await restfulClient.postWithPromise(
      C.VEHICLES_AGG_SEARCH_API,
      {field, size: DEFAULT_PAGE_SIZE},
      matchFields);
  }

  async getByVin (vin:string): Promise<APIResponse<any>> {
    const url = `${C.VEHICLE_VIN_DECODE_API}/${vin}`;
    return await restfulClient.getWithPromise(url);
  }

  async updateName (id:string, vehicleProfile:VehicleProfile): Promise<APIResponse<any>> {
    const url = `${C.VEHICLES_API}/${id}`;
    return await restfulClient.putWithPromise(url, vehicleProfile);
  }

  async saveNew (vehicleProfile:VehicleProfile): Promise<APIResponse<any>> {
    return await restfulClient.postWithPromise(C.VEHICLES_API, null, vehicleProfile);
  }

  async delete (id:string): Promise<APIResponse<any>> {
    const url = `${C.VEHICLES_API}/${id}`;
    return await restfulClient.deleteWithPromise(url);
  }

  private static normalizePagingSearch(pagingSearch:PagingSearch) {
    if (!pagingSearch.keyword) pagingSearch.keyword = "*";
    if (!pagingSearch.size) pagingSearch.size = C.DEFAULT_PAGE_SIZE;
    if (!pagingSearch.page) pagingSearch.page = 1;
  }

}

export default VehicleService;
