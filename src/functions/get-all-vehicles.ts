import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetAllVehiclesUseCase } from '@application/use-cases/get-all-vehicles.use-case';
import { VehicleDynamoDbRepository } from '@infrastructure/repositories/vehicle-dynamodb.repository';
import { VehicleSwapiRepository } from '@infrastructure/repositories/vehicle-swapi.repository';
import { createResponse, handleErrors } from '@common/response-utils';
import { VehicleResponseMapper } from '@functions/presenters/vehicle-response.mapper';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const dynamoDbRepository = new VehicleDynamoDbRepository();
    const swapiRepository = new VehicleSwapiRepository();
    const getAllVehiclesUseCase = new GetAllVehiclesUseCase(dynamoDbRepository, swapiRepository);

    const vehicles = await getAllVehiclesUseCase.execute();

    // Usar el mapper para transformar los vehículos al formato de salida
    const vehiclesOutput = vehicles.map(VehicleResponseMapper.toOutput);

    return createResponse(200, vehiclesOutput);
  } catch (error) {
    return handleErrors(error, 'Error interno del servidor al obtener los vehículos');
  }
};
