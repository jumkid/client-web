import { VehicleProfile } from '../../store/model/VehicleProfile';

interface PagingSearch {
  keyword:string | undefined
  page:number | undefined
  size:number | undefined
}

interface VehicleProfileUpdate {
  id:string
  vehicle:VehicleProfile
}

export {
  VehicleProfileUpdate,
  PagingSearch
}
