import { Vehicle } from '@domain/models/vehicle.model';
import { VehicleOutput } from '@domain/dtos/vehicle.output';
import { translateVehicleAttributes } from '@common/translate-vehicle-attributes';

export class VehicleResponseMapper {
  static toOutput(vehicle: Vehicle): VehicleOutput {
    return translateVehicleAttributes(vehicle);
  }
}
