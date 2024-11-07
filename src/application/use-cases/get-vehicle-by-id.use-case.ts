import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';
import { Vehicle } from '@domain/models/vehicle.model';

export class GetVehicleByIdUseCase {
  constructor(
    private readonly dynamoDbRepository: VehicleRepository,
    private readonly swapiRepository: VehicleRepository
  ) { }

  async execute(id: string): Promise<Vehicle | null> {
    // obtener el vehículo desde la db
    const vehicleFromDb = await this.dynamoDbRepository.findById(id);

    if (vehicleFromDb) {
      return vehicleFromDb;
    }

    const vehicleFromSwapi = await this.swapiRepository.findById(id);

    if (vehicleFromSwapi) {
      await this.dynamoDbRepository.create(vehicleFromSwapi);
      return vehicleFromSwapi;
    }

    return null;
  }
}
