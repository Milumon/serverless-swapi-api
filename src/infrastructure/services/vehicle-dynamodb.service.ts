import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamodbClientProvider } from '../providers/dynamodb-client.provider';
import config from '../../main/config/env-loader'

export class VehicleDynamoDbService {
  private client = new DynamodbClientProvider().documentClient;

  async getItemById(id: string): Promise<any> {
    const params = {
      TableName: config.DB_TABLE,
      Key: { id },
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item;
  }

  async putItem(item: any): Promise<void> {
    const params = {
      TableName: config.DB_TABLE,
      Item: item,
    };
    await this.client.send(new PutCommand(params));
  }

  async scanTable(): Promise<any[]> {
    const params = { TableName: config.DB_TABLE };
    const result = await this.client.send(new ScanCommand(params));
    return result.Items as any[];
  }
}
