import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import config from '../../main/config/env-loader';

export class DynamodbClientProvider {
  readonly documentClient: DynamoDBDocumentClient;

  constructor() {
    const dynamodbProvider = new DynamoDBClient({
      region: config.AWS_REGION,
    });

    this.documentClient = DynamoDBDocumentClient.from(dynamodbProvider, {
      marshallOptions: {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      },
    });
  }
}
