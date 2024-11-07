import { SwapiVehicle, VehicleModel } from '../types/vehicle.types';

export const translateVehicleAttributes = (vehicle: SwapiVehicle): VehicleModel => {
  return {
    id: vehicle.id,
    nombre: vehicle.name,
    modelo: vehicle.model,
    clase_vehiculo: vehicle.vehicle_class,
    fabricante: vehicle.manufacturer,
    longitud: vehicle.length,
    costo_en_creditos: vehicle.cost_in_credits,
    tripulacion: vehicle.crew,
    pasajeros: vehicle.passengers,
    velocidad_maxima: vehicle.max_atmosphering_speed,
    capacidad_carga: vehicle.cargo_capacity,
    consumibles: vehicle.consumables,
    peliculas: vehicle.films,
    pilotos: vehicle.pilots,
    url: vehicle.url,
    creado: vehicle.created,
    editado: vehicle.edited,
  };
};
