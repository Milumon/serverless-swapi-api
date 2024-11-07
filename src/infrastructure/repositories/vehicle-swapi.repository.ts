import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';
import { Vehicle } from '@domain/models/vehicle.model';
import { VehicleSwapiService } from '@infrastructure/services/vehicle-swapi.service';

export class VehicleSwapiRepository implements VehicleRepository {
  private swapiService = new VehicleSwapiService();

  async create(): Promise<Vehicle> {
    throw new Error('Método no implementado');
  }

  async findById(id: string): Promise<Vehicle | null> {
    const data = await this.swapiService.getVehicleById(id);
    return data ? new Vehicle(data) : null;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehiclesData = await this.swapiService.getAllVehicles();
    return vehiclesData ? vehiclesData.map(data => new Vehicle(data)) : [];
  }
}
