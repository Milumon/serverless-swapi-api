import { SwapiVehicle } from '../../types/vehicle.types';

export class CreateVehicleInput implements SwapiVehicle {
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

  constructor(data: any) {
    this.id = data.id;
    this.name = data.nombre || data.name;
    this.model = data.modelo || data.model;
    this.vehicle_class = data.clase_vehiculo || data.vehicle_class;
    this.manufacturer = data.fabricante || data.manufacturer;
    this.length = data.longitud || data.length;
    this.cost_in_credits = data.costo_en_creditos || data.cost_in_credits;
    this.crew = data.tripulacion || data.crew;
    this.passengers = data.pasajeros || data.passengers;
    this.max_atmosphering_speed = data.velocidad_maxima || data.max_atmosphering_speed;
    this.cargo_capacity = data.capacidad_carga || data.cargo_capacity;
    this.consumables = data.consumibles || '';
    this.films = data.peliculas || data.films || [];
    this.pilots = data.pilotos || data.pilots || [];
    this.url = data.url || '';
    this.created = data.creado || data.created || new Date().toISOString();
    this.edited = data.editado || data.edited || new Date().toISOString();
  }
}
