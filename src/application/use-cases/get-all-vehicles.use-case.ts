import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';
import { Vehicle } from '@domain/models/vehicle.model';

export class GetAllVehiclesUseCase {
  constructor(
    private readonly dynamoDbRepository: VehicleRepository,
    private readonly swapiRepository: VehicleRepository
  ) { }

  async execute(): Promise<Vehicle[]> {
    const vehiclesFromDb = await this.dynamoDbRepository.findAll();

    const vehiclesFromSwapi = (await this.swapiRepository.findAll()).map(data => new Vehicle(data));

    const dbVehiclesMap = new Map(vehiclesFromDb.map(vehicle => [vehicle.id, vehicle]));

    // Filtra los vehículos que ya existen en la base de datos
    const newVehicles = vehiclesFromSwapi.filter(vehicle => !dbVehiclesMap.has(vehicle.id));

    // Almacenar los nuevos vehículos en DynamoDB
    await Promise.all(
      newVehicles.map(async (vehicle) => {
        await this.dynamoDbRepository.create(vehicle);
      })
    );

    return [...vehiclesFromDb, ...newVehicles];
  }
}
