import { VehicleEngine } from './VehicleEngine';
import { VehicleTransmission } from './VehicleTransmission';
import { AccessScope } from '../../service/model/CommonTypes';
import { VehiclePricing } from './VehiclePricing';

export type VehicleProfile = {
    id?: string | null
    name?: string | null
    make?: string | null
    model?: string | null
    modelYear?: number | null
    trimLevel?: string | null
    mediaGalleryId?: string | null
    accessScope: AccessScope | null
    vehiclePricing?: VehiclePricing | null
    vehicleEngine?: VehicleEngine
    vehicleTransmission?: VehicleTransmission
    modificationDate?: string
}