import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '@functions/get-vehicle-by-id';
import { VehicleDynamoDbRepository } from '@infrastructure/repositories/vehicle-dynamodb.repository';
import { VehicleSwapiRepository } from '@infrastructure/repositories/vehicle-swapi.repository';
import { GetVehicleByIdUseCase } from '@application/use-cases/get-vehicle-by-id.use-case';
import { createResponse, handleErrors } from '@common/response-utils';
import { VehicleResponseMapper } from '@functions/presenters/vehicle-response.mapper';
import { Vehicle } from '@domain/models/vehicle.model';

jest.mock('@infrastructure/repositories/vehicle-dynamodb.repository');
jest.mock('@infrastructure/repositories/vehicle-swapi.repository');
jest.mock('@application/use-cases/get-vehicle-by-id.use-case');
jest.mock('@common/response-utils', () => ({
    createResponse: jest.fn(),
    handleErrors: jest.fn(),
}));
jest.mock('@functions/presenters/vehicle-response.mapper', () => ({
    VehicleResponseMapper: {
        toOutput: jest.fn(),
    },
}));


describe('getVehicleById handler', () => {
    let dynamoDbRepositoryMock: jest.Mocked<VehicleDynamoDbRepository>;
    let swapiRepositoryMock: jest.Mocked<VehicleSwapiRepository>;
    let getVehicleByIdUseCaseMock: jest.Mocked<GetVehicleByIdUseCase>;

    beforeEach(() => {
        dynamoDbRepositoryMock = new VehicleDynamoDbRepository() as jest.Mocked<VehicleDynamoDbRepository>;
        swapiRepositoryMock = new VehicleSwapiRepository() as jest.Mocked<VehicleSwapiRepository>;
        getVehicleByIdUseCaseMock = new GetVehicleByIdUseCase(dynamoDbRepositoryMock, swapiRepositoryMock) as jest.Mocked<GetVehicleByIdUseCase>;

        (VehicleDynamoDbRepository as jest.Mock).mockReturnValue(dynamoDbRepositoryMock);
        (VehicleSwapiRepository as jest.Mock).mockReturnValue(swapiRepositoryMock);
        (GetVehicleByIdUseCase as jest.Mock).mockReturnValue(getVehicleByIdUseCaseMock);

        // Configura el mock para `toOutput`
        (VehicleResponseMapper.toOutput as jest.Mock).mockImplementation((vehicle) => ({
            id: vehicle.id,
            name: vehicle.name,
        }));
    });

    it('should return 400 if vehicle ID is not provided', async () => {
        const event = { pathParameters: {} } as APIGatewayEvent;
        (createResponse as jest.Mock).mockReturnValue({ statusCode: 400, body: JSON.stringify({ message: 'El ID del vehículo es requerido' }) });

        const response = await handler(event);

        expect(createResponse).toHaveBeenCalledWith(400, { message: 'El ID del vehículo es requerido' });
        expect(response.statusCode).toBe(400);
    });

    it('should return 200 with vehicle data if vehicle is found', async () => {
        const event = { pathParameters: { id: '123' } } as unknown as APIGatewayEvent;
        const vehicle = new Vehicle({ id: '123', name: 'Speeder Bike' });
        getVehicleByIdUseCaseMock.execute.mockResolvedValue(vehicle);

        const expectedVehicleOutput = { id: '123', name: 'Speeder Bike' };
        (createResponse as jest.Mock).mockReturnValue({ statusCode: 200, body: JSON.stringify(expectedVehicleOutput) });

        const response = await handler(event);

        expect(getVehicleByIdUseCaseMock.execute).toHaveBeenCalledWith('123');
        expect(VehicleResponseMapper.toOutput).toHaveBeenCalledWith(vehicle);
        expect(createResponse).toHaveBeenCalledWith(200, expectedVehicleOutput);
        expect(response.statusCode).toBe(200);
    });

    it('should return 404 if vehicle is not found', async () => {
        const event = { pathParameters: { id: '456' } } as unknown as APIGatewayEvent;
        getVehicleByIdUseCaseMock.execute.mockResolvedValue(null);

        (createResponse as jest.Mock).mockReturnValue({ statusCode: 404, body: JSON.stringify({ message: 'Vehículo no encontrado' }) });

        const response = await handler(event);

        expect(getVehicleByIdUseCaseMock.execute).toHaveBeenCalledWith('456');
        expect(createResponse).toHaveBeenCalledWith(404, { message: 'Vehículo no encontrado' });
        expect(response.statusCode).toBe(404);
    });

    it('should handle errors and return a server error response', async () => {
        const event = { pathParameters: { id: '789' } } as unknown as APIGatewayEvent;
        const error = new Error('Internal server error');
        getVehicleByIdUseCaseMock.execute.mockRejectedValue(error);

        (handleErrors as jest.Mock).mockReturnValue({
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor al obtener el vehículo' }),
        });

        const response = await handler(event);

        expect(getVehicleByIdUseCaseMock.execute).toHaveBeenCalledWith('789');
        expect(handleErrors).toHaveBeenCalledWith(error, 'Error interno del servidor al obtener el vehículo');
        expect(response.statusCode).toBe(500);
    });
});
