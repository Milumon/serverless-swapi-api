import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';
import { Vehicle } from '@domain/models/vehicle.model';
import { CreateVehicleInput } from '@domain/dtos/create-vehicle.input';

export class CreateVehicleUseCase {
  constructor(private readonly repository: VehicleRepository) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    const vehicle = new Vehicle(input);
    return this.repository.create(vehicle);
  }
}
