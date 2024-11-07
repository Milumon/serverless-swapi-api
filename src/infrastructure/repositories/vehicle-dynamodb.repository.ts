import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';
import { Vehicle } from '@domain/models/vehicle.model';
import { VehicleDynamoDbService } from '@infrastructure/services/vehicle-dynamodb.service';


export class VehicleDynamoDbRepository implements VehicleRepository {
  private dbService = new VehicleDynamoDbService();

  async create(vehicle: Vehicle): Promise<Vehicle> {
    await this.dbService.putItem(vehicle); 
    return vehicle;
  }

  async findById(id: string): Promise<Vehicle | null> {
    const item = await this.dbService.getItemById(id);
    return item ? (item as Vehicle) : null;
  }

  async findAll(): Promise<Vehicle[]> {
    const items = await this.dbService.scanTable();
    return items ? (items as Vehicle[]) : [];
  }
}
