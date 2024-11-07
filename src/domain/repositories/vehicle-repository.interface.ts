import { Vehicle } from '@domain/models/vehicle.model';

export interface VehicleRepository {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
}
