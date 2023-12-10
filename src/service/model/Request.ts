import { VehicleProfile } from '../../store/model/VehicleProfile';
import { KeywordMode } from './CommonTypes';

interface PagingSearch {
  page:number | undefined
  size:number | undefined
  keyword?: string,
  keywordMode?: KeywordMode,
  data?: object | object[] | string
}

interface VehicleProfileUpdate {
  id:string
  vehicle:VehicleProfile
}

export {
  VehicleProfileUpdate,
  PagingSearch
}
