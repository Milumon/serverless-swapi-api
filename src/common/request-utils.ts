import { APIGatewayEvent } from 'aws-lambda';

export const parseRequestBody = <T>(event: APIGatewayEvent): T => {
  try {
    const body = JSON.parse(event.body || '{}');
    return body as T;
  } catch (error) {
    console.error('Failed to parse request body:', error);
    throw new Error('Invalid request body');
  }
};
