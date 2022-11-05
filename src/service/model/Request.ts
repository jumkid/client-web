import { VehicleProfile } from '../../store/model/VehicleProfile';

interface PagingSearch {
  page:number | undefined
  size:number | undefined
  keyword?:string
}

interface VehicleProfileUpdate {
  id:string
  vehicle:VehicleProfile
}

export {
  VehicleProfileUpdate,
  PagingSearch
}
