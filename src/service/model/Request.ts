import { VehicleProfile } from '../../store/model/VehicleProfile';

interface PagingSearch {
  page:number | undefined
  size:number | undefined
  keyword?:string,
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
