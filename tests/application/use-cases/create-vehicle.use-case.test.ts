import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { CreateVehicleUseCase } from '@application/use-cases/create-vehicle.use-case';
import { VehicleDynamoDbRepository } from '@infrastructure/repositories/vehicle-dynamodb.repository';
import { CreateVehicleInput } from '@domain/dtos/create-vehicle.input';
import { Vehicle } from '@domain/models/vehicle.model';

describe('CreateVehicleUseCase', () => {
    const dynamoDbMock = mockClient(DynamoDBDocumentClient);
    let useCase: CreateVehicleUseCase;
    let repository: VehicleDynamoDbRepository;

    beforeEach(() => {
        dynamoDbMock.reset();
        repository = new VehicleDynamoDbRepository();
        useCase = new CreateVehicleUseCase(repository);
    });

    it('should create a vehicle and save it to the database', async () => {
        dynamoDbMock.on(PutCommand).resolves({});

        const input = new CreateVehicleInput({
            id: '123',
            name: 'X-Wing',
            model: 'T-65 X-wing starfighter',
            vehicle_class: 'Starfighter',
            manufacturer: 'Incom Corporation',
            length: '12.5',
            cost_in_credits: '150000',
            crew: '1',
            passengers: '0',
            max_atmosphering_speed: '1050',
            cargo_capacity: '110',
            consumables: '1 week',
            films: [],
            pilots: [],
            url: '',
            created: '',
            edited: '',
        });

        const createdVehicle = await useCase.execute(input);

        expect(dynamoDbMock.calls()).toHaveLength(1);

        const putCommandCall = dynamoDbMock.calls()[0].args[0];
        expect(putCommandCall).toBeInstanceOf(PutCommand);
        expect(putCommandCall.input).toEqual({
            TableName: process.env.DB_TABLE,
            Item: expect.objectContaining({
                id: '123',
                name: 'X-Wing',
                model: 'T-65 X-wing starfighter',
                vehicle_class: 'Starfighter',
                manufacturer: 'Incom Corporation',
            }),
        });

        expect(createdVehicle).toHaveProperty('id', '123');
        expect(createdVehicle).toHaveProperty('name', 'X-Wing');
        expect(createdVehicle).toBeInstanceOf(Vehicle);
    });
});
