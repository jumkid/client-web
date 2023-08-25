import restfulClient from './RestfulClient';
import { APIPagingResponse, APIResponse } from './model/Response';
import { PagingSearch } from './model/Request';
import { VehicleProfile } from '../store/model/VehicleProfile';
import * as C from '../App.constants';
import * as _ from 'lodash';

export interface VehicleFieldValuePair {
  field:string
  value:string
}

export interface IVehicleService {
  getByUser: (pagingSearch:PagingSearch) => Promise<APIPagingResponse<VehicleProfile>>
  getByPublic: (pagingSearch:PagingSearch) => Promise<APIPagingResponse<VehicleProfile>>
  getByMatchers: (pagingSearch:PagingSearch) => Promise<APIPagingResponse<VehicleProfile> | null>
  getByVin: (vin:string) => Promise<APIResponse<any>>
  getForAggregation: (field:string, matchFields:VehicleFieldValuePair[]) => Promise<APIResponse<any>>

  update: (id:string, vehicleProfile:VehicleProfile) => Promise<APIResponse<any>>
  updateName: (id:string, vehicleProfile:VehicleProfile) => Promise<APIResponse<any>>

  saveAsNew: (vehicleProfile:VehicleProfile) => Promise<APIResponse<any>>

  copyGallery: (id:string, sourceMediaGalleryId:string) => Promise<APIResponse<any>>
}

class VehicleService implements IVehicleService {

  async getByUser (pagingSearch:PagingSearch): Promise<APIPagingResponse<VehicleProfile>> {
    VehicleService.normalizePagingSearch(pagingSearch);
    const response = await restfulClient.getWithPromise(C.VEHICLES_SEARCH_API, pagingSearch);
    return response.data;
  }

  async getByPublic (pagingSearch:PagingSearch): Promise<APIPagingResponse<VehicleProfile>> {
    VehicleService.normalizePagingSearch(pagingSearch);
    const response = await restfulClient.getWithPromise(C.VEHICLES_PUBLIC_SEARCH_API, pagingSearch);
    return response.data;
  }

  async getByMatchers (pagingSearch:PagingSearch): Promise<APIPagingResponse<VehicleProfile>> {
    VehicleService.normalizePagingSearch(pagingSearch);
    return await restfulClient.postWithPaging(C.VEHICLES_MATCHERS_SEARCH_API, pagingSearch, pagingSearch.data);
  }

  async getForAggregation (field: string, matchFields: VehicleFieldValuePair[]): Promise<APIResponse<any>> {
    return await restfulClient.postWithPromise(
      C.VEHICLES_AGG_SEARCH_API,
      {field, size: 100},
      matchFields);
  }

  async getByVin (vin:string): Promise<APIResponse<any>> {
    const url = `${C.VEHICLE_VIN_DECODE_API}/${vin}`;
    return await restfulClient.getWithPromise(url);
  }

  async update (id:string, vehicleProfile:VehicleProfile): Promise<APIResponse<VehicleProfile>> {
    const url = `${C.VEHICLES_API}/${id}`;
    return await restfulClient.putWithPromise(url, vehicleProfile);
  }

  async updateName (id:string, vehicleProfile:VehicleProfile): Promise<APIResponse<any>> {
    const url = `${C.VEHICLES_API}/${id}`;
    return await restfulClient.putWithPromise(url, vehicleProfile);
  }

  async saveAsNew (vehicleProfile:VehicleProfile): Promise<APIResponse<any>> {
    return await restfulClient.postWithPromise(C.VEHICLES_SAVE_AS_NEW_API, null, vehicleProfile);
  }

  async save (vehicleProfile:VehicleProfile): Promise<APIResponse<any>> {
    return await restfulClient.postWithPromise(C.VEHICLES_API, null, vehicleProfile);
  }

  async copyGallery (id: string, sourceMediaGalleryId: string): Promise<APIResponse<string>> {
    const compiled = _.template(C.VEHICLE_GALLERY_COPY_API);
    const url = compiled({'id': id});
    const params = {sourceMediaGalleryId};

    return await restfulClient.postWithPromise(url, params);
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
