import { APIGatewayProxyResult } from 'aws-lambda';

export const createResponse = <T>(statusCode: number, body: T): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

export const handleErrors = (error: unknown, message: string): APIGatewayProxyResult => {
  console.error(message, error);
  return createResponse(500, { message });
};
