import { GetAllVehiclesUseCase } from '@application/use-cases/get-all-vehicles.use-case';
import { Vehicle } from '@domain/models/vehicle.model';
import { VehicleRepository } from '@domain/repositories/vehicle-repository.interface';

describe('GetAllVehiclesUseCase', () => {
  let dynamoDbRepository: jest.Mocked<VehicleRepository>;
  let swapiRepository: jest.Mocked<VehicleRepository>;
  let useCase: GetAllVehiclesUseCase;

  beforeEach(() => {
    dynamoDbRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };
    swapiRepository = {
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new GetAllVehiclesUseCase(dynamoDbRepository, swapiRepository);
  });

  it('should return vehicles from DynamoDB if available', async () => {
    const vehiclesFromDb = [new Vehicle({ id: '1', name: 'Speeder Bike' })];
    dynamoDbRepository.findAll.mockResolvedValue(vehiclesFromDb);

    const result = await useCase.execute();

    expect(dynamoDbRepository.findAll).toHaveBeenCalledTimes(1);
    expect(swapiRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(vehiclesFromDb);
  });

  it('should fetch from SWAPI, store new vehicles in DynamoDB, and return combined list if DynamoDB is empty', async () => {
    // Simular DynamoDB vacío y SWAPI con vehículos
    dynamoDbRepository.findAll.mockResolvedValue([]);
    const vehiclesFromSwapi = [new Vehicle({ id: '2', name: 'X-Wing' })];
    swapiRepository.findAll.mockResolvedValue(vehiclesFromSwapi);

    const result = await useCase.execute();

    // Verificar llamadas a los métodos
    expect(dynamoDbRepository.findAll).toHaveBeenCalledTimes(1);
    expect(swapiRepository.findAll).toHaveBeenCalledTimes(1);
    expect(dynamoDbRepository.create).toHaveBeenCalledTimes(vehiclesFromSwapi.length);
    vehiclesFromSwapi.forEach((vehicle, index) => {
      expect(dynamoDbRepository.create).toHaveBeenNthCalledWith(index + 1, vehicle);
    });

    // Verificar que el resultado coincide con los vehículos obtenidos de SWAPI
    expect(result).toEqual(vehiclesFromSwapi);
  });

  it('should only store new vehicles from SWAPI in DynamoDB when DynamoDB has some vehicles', async () => {
    // Simular vehículos existentes en DynamoDB
    const vehiclesFromDb = [new Vehicle({ id: '1', name: 'Speeder Bike' })];
    dynamoDbRepository.findAll.mockResolvedValue(vehiclesFromDb);

    // Simular SWAPI con un vehículo nuevo y uno duplicado
    const vehiclesFromSwapi = [
      new Vehicle({ id: '1', name: 'Speeder Bike' }), // duplicado
      new Vehicle({ id: '2', name: 'X-Wing' }),       // nuevo
    ];
    swapiRepository.findAll.mockResolvedValue(vehiclesFromSwapi);

    const result = await useCase.execute();

    // Verificar que solo el vehículo nuevo se almacena en DynamoDB
    expect(dynamoDbRepository.create).toHaveBeenCalledTimes(1);
    expect(dynamoDbRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ id: '2', name: 'X-Wing' })
    );

    // Verificar que el resultado es la combinación de vehículos
    expect(result).toEqual([...vehiclesFromDb, new Vehicle({ id: '2', name: 'X-Wing' })]);
  });
});
