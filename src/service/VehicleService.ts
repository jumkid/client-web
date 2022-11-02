import * as C from '../App.constants';
import dataExchangeService from './DataExchangeService';
import { APIResponse } from './model/Response';
import { PagingSearch } from './model/Request';
import { VehicleProfile } from '../store/model/VehicleProfile';

export interface IVehicleService {
  getByUser: (pagingSearch:PagingSearch) => Promise<APIResponse>
  getByPublic: (pagingSearch:PagingSearch) => Promise<APIResponse>
  updateName: (id:string, vehicleProfile:VehicleProfile) => Promise<APIResponse>
}

class VehicleService implements IVehicleService {

  async getByUser (pagingSearch:PagingSearch) {
    if (!pagingSearch.keyword) pagingSearch.keyword = "*";
    if (!pagingSearch.size) pagingSearch.size = C.DEFAULT_PAGE_SIZE;
    if (!pagingSearch.page) pagingSearch.page = 1;

    const response = await dataExchangeService.getWithPromise(C.VEHICLES_SEARCH_API, pagingSearch);
    return (response != null) && response.data.data || [];
  }

  async getByPublic (pagingSearch:PagingSearch): Promise<APIResponse> {
    if (!pagingSearch.keyword) pagingSearch.keyword = "*";
    if (!pagingSearch.size) pagingSearch.size = C.DEFAULT_PAGE_SIZE;
    if (!pagingSearch.page) pagingSearch.page = 1;

    const response = await dataExchangeService.getWithPromise(C.VEHICLES_PUBLIC_SEARCH_API, pagingSearch);
    return (response != null) && response.data || [];
  }

  async updateName (id:string, vehicleProfile:VehicleProfile): Promise<APIResponse> {
    const url = `${C.VEHICLES_API}/${id}`;
    const response = await dataExchangeService.putWithPromise(url, vehicleProfile);
    return (response != null) && response.data || [];
  }

  async saveNew (vehicleProfile:VehicleProfile): Promise<APIResponse> {
    const response = await dataExchangeService.postWithPromise(C.VEHICLES_API, vehicleProfile);
    return (response != null) && response.data || [];
  }

  async delete (id:string): Promise<APIResponse> {
    const url = `${C.VEHICLES_API}/${id}`;
    const response = await dataExchangeService.deleteWithPromise(url);
    return (response != null) && response.data || [];
  }

}

export default VehicleService;
