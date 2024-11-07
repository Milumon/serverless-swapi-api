export interface SwapiVehicle {
  id: string;
  name: string;
  model: string;
  vehicle_class: string;
  manufacturer: string;
  length: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  created: string;
  edited: string;
}

export interface VehicleModel {
  id: string;
  nombre: string;
  modelo: string;
  clase_vehiculo: string;
  fabricante: string;
  longitud: string;
  costo_en_creditos: string;
  tripulacion: string;
  pasajeros: string;
  velocidad_maxima: string;
  capacidad_carga: string;
  consumibles: string;
  peliculas: string[];
  pilotos: string[];
  url: string;
  creado: string;
  editado: string;
}
