import { APIGatewayEvent } from 'aws-lambda';
import { handler } from '@functions/create-vehicle';
import { VehicleDynamoDbRepository } from '@infrastructure/repositories/vehicle-dynamodb.repository';
import { VehicleSwapiRepository } from '@infrastructure/repositories/vehicle-swapi.repository';
import { CreateVehicleUseCase } from '@application/use-cases/create-vehicle.use-case';
import { Vehicle } from '@domain/models/vehicle.model';
import { CreateVehicleInput } from '@domain/dtos/create-vehicle.input';
import { createResponse } from '@common/response-utils';

jest.mock('@infrastructure/repositories/vehicle-dynamodb.repository');
jest.mock('@infrastructure/repositories/vehicle-swapi.repository');
jest.mock('@application/use-cases/create-vehicle.use-case');
jest.mock('@common/response-utils', () => ({
  createResponse: jest.fn(),
}));


describe('createVehicle handler', () => {
  let dynamoDbRepositoryMock: jest.Mocked<VehicleDynamoDbRepository>;
  let swapiRepositoryMock: jest.Mocked<VehicleSwapiRepository>;
  let createVehicleUseCaseMock: jest.Mocked<CreateVehicleUseCase>;

  beforeEach(() => {
    dynamoDbRepositoryMock = new VehicleDynamoDbRepository() as jest.Mocked<VehicleDynamoDbRepository>;
    swapiRepositoryMock = new VehicleSwapiRepository() as jest.Mocked<VehicleSwapiRepository>;
    createVehicleUseCaseMock = new CreateVehicleUseCase(dynamoDbRepositoryMock) as jest.Mocked<CreateVehicleUseCase>;

    (VehicleDynamoDbRepository as jest.Mock).mockReturnValue(dynamoDbRepositoryMock);
    (VehicleSwapiRepository as jest.Mock).mockReturnValue(swapiRepositoryMock);
    (CreateVehicleUseCase as jest.Mock).mockReturnValue(createVehicleUseCaseMock);
  });

  it('should return 400 if vehicle ID is missing', async () => {
    const event = { body: JSON.stringify({}) } as APIGatewayEvent;
    (createResponse as jest.Mock).mockReturnValue({ statusCode: 400, body: JSON.stringify({ message: 'El ID del vehículo debe estar presente' }) });

    const response = await handler(event);

    expect(createResponse).toHaveBeenCalledWith(400, { message: 'El ID del vehículo debe estar presente' });
    expect(response.statusCode).toBe(400);
  });

  it('should return 409 if vehicle already exists in DynamoDB', async () => {
    const existingVehicle = new Vehicle({ id: '123', name: 'X-Wing' });
    dynamoDbRepositoryMock.findById.mockResolvedValue(existingVehicle);
    const event = { body: JSON.stringify({ id: '123' }) } as APIGatewayEvent;
    (createResponse as jest.Mock).mockReturnValue({ statusCode: 409, body: JSON.stringify({ message: 'El vehículo ya existe en la base de datos', vehicle: existingVehicle }) });

    const response = await handler(event);

    expect(dynamoDbRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(createResponse).toHaveBeenCalledWith(409, { message: 'El vehículo ya existe en la base de datos', vehicle: expect.any(Object) });
    expect(response.statusCode).toBe(409);
  });

  it('should return 409 if vehicle exists in SWAPI and save it in DynamoDB', async () => {
    dynamoDbRepositoryMock.findById.mockResolvedValue(null); // No existe en DynamoDB
    const existingVehicleInSwapi = new Vehicle({ id: '123', name: 'X-Wing' });
    swapiRepositoryMock.findById.mockResolvedValue(existingVehicleInSwapi);
    const event = { body: JSON.stringify({ id: '123', url: 'https://swapi.dev/api/vehicles/1/' }) } as APIGatewayEvent;
    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 409,
      body: JSON.stringify({ message: 'El vehículo ya existe en SWAPI y se ha guardado en la base de datos', vehicle: existingVehicleInSwapi }),
    });

    const response = await handler(event);

    expect(dynamoDbRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(swapiRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(dynamoDbRepositoryMock.create).toHaveBeenCalledWith(existingVehicleInSwapi);
    expect(createResponse).toHaveBeenCalledWith(409, {
      message: 'El vehículo ya existe en SWAPI y se ha guardado en la base de datos',
      vehicle: expect.any(Object),
    });
    expect(response.statusCode).toBe(409);
  });

  it('should create a new vehicle in DynamoDB if not found in both DynamoDB and SWAPI', async () => {
    dynamoDbRepositoryMock.findById.mockResolvedValue(null); // No existe en DynamoDB
    swapiRepositoryMock.findById.mockResolvedValue(null); // No existe en SWAPI
    const newVehicle = new Vehicle({ id: '123', name: 'X-Wing' });
    createVehicleUseCaseMock.execute.mockResolvedValue(newVehicle);
    const event = { body: JSON.stringify({ id: '123', name: 'X-Wing' }) } as APIGatewayEvent;
    (createResponse as jest.Mock).mockReturnValue({ statusCode: 201, body: JSON.stringify(newVehicle) });

    const response = await handler(event);

    expect(dynamoDbRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(swapiRepositoryMock.findById).toHaveBeenCalledWith('123');
    expect(createVehicleUseCaseMock.execute).toHaveBeenCalledWith(expect.any(CreateVehicleInput));
    expect(createResponse).toHaveBeenCalledWith(201, expect.any(Object));
    expect(response.statusCode).toBe(201);
  });
});
