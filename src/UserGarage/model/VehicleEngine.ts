export interface VehicleEngine {
    vehicleEngineId?: number | null
    name: string | null
    type: string | null
    cylinder: number | null
    displacement: number | null
    fuelType: string | null,
    horsepower: number | null
    horsepowerRpm: number | null
    torque: number | null
    torqueRpm: number | null
    manufacturerEngineCode: string | null
}