import axios from 'axios';
import config from '../../main/config/env-loader'
import { SwapiVehicle } from '../../types/vehicle.types';

export class VehicleSwapiService {
  async getVehicleById(id: string): Promise<SwapiVehicle | null> {
    try {
      const response = await axios.get<SwapiVehicle>(`${config.SWAPI_BASE_URL}/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el vehículo con ID ${id} desde SWAPI`, error);
      return null;
    }
  }

  async getAllVehicles(): Promise<SwapiVehicle[]> {
    try {
      const response = await axios.get<{ results: SwapiVehicle[] }>(`${config.SWAPI_BASE_URL}/vehicles`);
      return response.data.results;
    } catch (error) {
      console.error("Error al obtener los vehículos desde SWAPI", error);
      return [];
    }
  }
}
