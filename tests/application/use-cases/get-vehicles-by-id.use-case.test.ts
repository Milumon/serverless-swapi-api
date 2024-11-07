import { GetVehicleByIdUseCase } from '@application/use-cases/get-vehicle-by-id.use-case';
import { Vehicle } from '@domain/models/vehicle.model';
import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';

describe('GetVehicleByIdUseCase', () => {
  let dynamoDbRepository: jest.Mocked<VehicleRepository>;
  let swapiRepository: jest.Mocked<VehicleRepository>;
  let useCase: GetVehicleByIdUseCase;

  beforeEach(() => {
    dynamoDbRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    swapiRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new GetVehicleByIdUseCase(dynamoDbRepository, swapiRepository);
  });

  it('should return the vehicle from DynamoDB if it exists', async () => {
    const vehicleFromDb = new Vehicle({ id: '123', name: 'Speeder Bike' });
    dynamoDbRepository.findById.mockResolvedValue(vehicleFromDb);

    const result = await useCase.execute('123');

    expect(dynamoDbRepository.findById).toHaveBeenCalledWith('123');
    expect(swapiRepository.findById).not.toHaveBeenCalled();
    expect(result).toEqual(vehicleFromDb);
  });

  it('should return the vehicle from SWAPI and save it to DynamoDB if it does not exist in DynamoDB', async () => {
    dynamoDbRepository.findById.mockResolvedValue(null); // DynamoDB no tiene el vehículo
    const vehicleFromSwapi = new Vehicle({ id: '123', name: 'X-Wing' });
    swapiRepository.findById.mockResolvedValue(vehicleFromSwapi);

    const result = await useCase.execute('123');

    expect(dynamoDbRepository.findById).toHaveBeenCalledWith('123');
    expect(swapiRepository.findById).toHaveBeenCalledWith('123');
    expect(dynamoDbRepository.create).toHaveBeenCalledWith(vehicleFromSwapi);
    expect(result).toEqual(vehicleFromSwapi);
  });

  it('should return null if the vehicle does not exist in DynamoDB or SWAPI', async () => {
    dynamoDbRepository.findById.mockResolvedValue(null); // DynamoDB no tiene el vehículo
    swapiRepository.findById.mockResolvedValue(null); // SWAPI tampoco tiene el vehículo

    const result = await useCase.execute('123');

    expect(dynamoDbRepository.findById).toHaveBeenCalledWith('123');
    expect(swapiRepository.findById).toHaveBeenCalledWith('123');
    expect(dynamoDbRepository.create).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
