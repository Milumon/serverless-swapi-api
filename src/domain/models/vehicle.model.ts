import { SwapiVehicle } from '../../types/vehicle.types';

export class Vehicle implements SwapiVehicle {
  public id: string; 
  public name: string;
  public model: string;
  public vehicle_class: string;
  public manufacturer: string;
  public length: string;
  public cost_in_credits: string;
  public crew: string;
  public passengers: string;
  public max_atmosphering_speed: string;
  public cargo_capacity: string;
  public consumables: string;
  public films: string[];
  public pilots: string[];
  public url: string;
  public created: string;
  public edited: string;

  constructor(data: Partial<SwapiVehicle> & { id: string }) {
    this.id = data.url ? this.extractIdFromUrl(data.url) : data.id; 
    this.name = data.name || '';
    this.model = data.model || '';
    this.vehicle_class = data.vehicle_class || '';
    this.manufacturer = data.manufacturer || '';
    this.length = data.length || '';
    this.cost_in_credits = data.cost_in_credits || '';
    this.crew = data.crew || '';
    this.passengers = data.passengers || '';
    this.max_atmosphering_speed = data.max_atmosphering_speed || '';
    this.cargo_capacity = data.cargo_capacity || '';
    this.consumables = data.consumables || '';
    this.films = data.films || [];
    this.pilots = data.pilots || [];
    this.url = data.url || '';
    this.created = data.created || '';
    this.edited = data.edited || '';
  }

  private extractIdFromUrl(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }
}
