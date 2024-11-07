import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetVehicleByIdUseCase } from '@application/use-cases/get-vehicle-by-id.use-case';
import { VehicleDynamoDbRepository } from '@infrastructure/repositories/vehicle-dynamodb.repository';
import { VehicleSwapiRepository } from '@infrastructure/repositories/vehicle-swapi.repository';
import { createResponse, handleErrors } from '@common/response-utils';
import { VehicleResponseMapper } from '@functions/presenters/vehicle-response.mapper';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return createResponse(400, { message: 'El ID del vehículo es requerido' });
    }

    const dynamoDbRepository = new VehicleDynamoDbRepository();
    const swapiRepository = new VehicleSwapiRepository();
    const getVehicleByIdUseCase = new GetVehicleByIdUseCase(dynamoDbRepository, swapiRepository);

    const vehicle = await getVehicleByIdUseCase.execute(id);

    if (vehicle) {
      const vehicleOutput = VehicleResponseMapper.toOutput(vehicle);
      return createResponse(200, vehicleOutput);
    } else {
      return createResponse(404, { message: 'Vehículo no encontrado' });
    }
  } catch (error) {
    return handleErrors(error, 'Error interno del servidor al obtener el vehículo');
  }
};
