import { VehicleEngine } from './VehicleEngine';
import { VehicleTransmission } from './VehicleTransmission';

type AccessScope = "private" | "public"

export interface VehicleProfile {
    id?: string | null
    name?: string | null
    make?: string | null
    model?: string | null
    modelYear?: number | null
    trimLevel?: string | null
    mediaGalleryId?: string | null
    accessScope: AccessScope | null
    vehicleEngine?: VehicleEngine
    vehicleTransmission?: VehicleTransmission
    modificationDate?: string
}