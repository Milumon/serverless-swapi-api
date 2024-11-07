import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateVehicleUseCase } from '@application/use-cases/create-vehicle.use-case';
import { VehicleDynamoDbRepository } from '@infrastructure/repositories/vehicle-dynamodb.repository';
import { VehicleSwapiRepository } from '@infrastructure/repositories/vehicle-swapi.repository';
import { CreateVehicleInput } from '@domain/dtos/create-vehicle.input';
import { createResponse, handleErrors } from '@common/response-utils';
import { VehicleResponseMapper } from '@functions/presenters/vehicle-response.mapper';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const inputData = JSON.parse(event.body || '{}');

    if (!inputData.id) {
      return createResponse(400, { message: 'El ID del vehículo debe estar presente' });
    }

    const createVehicleInput = new CreateVehicleInput(inputData);

    const dynamoDbRepository = new VehicleDynamoDbRepository();
    const swapiRepository = new VehicleSwapiRepository();

    // Verificar que el ID no exista en DynamoDB
    const existingVehicleInDb = await dynamoDbRepository.findById(inputData.id.toString());
    if (existingVehicleInDb) {
      const vehicleOutput = VehicleResponseMapper.toOutput(existingVehicleInDb);
      return createResponse(409, { message: 'El vehículo ya existe en la base de datos', vehicle: vehicleOutput });
    }

    // Verificar que el ID no exista en SWAPI si se proporciona un URL
    if (inputData.url) {
      const existingVehicleInSwapi = await swapiRepository.findById(inputData.id.toString());
      if (existingVehicleInSwapi) {
        await dynamoDbRepository.create(existingVehicleInSwapi);
        const vehicleOutput = VehicleResponseMapper.toOutput(existingVehicleInSwapi);
        return createResponse(409, { message: 'El vehículo ya existe en SWAPI y se ha guardado en la base de datos', vehicle: vehicleOutput });
      }
    }

    // Crear el vehículo en DynamoDB si no existe en ningún lado
    const createVehicleUseCase = new CreateVehicleUseCase(dynamoDbRepository);
    const newVehicle = await createVehicleUseCase.execute(createVehicleInput);

    const vehicleOutput = VehicleResponseMapper.toOutput(newVehicle);
    return createResponse(201, vehicleOutput);
  } catch (error) {
    return handleErrors(error, 'Error interno del servidor al crear el vehículo');
  }
};
