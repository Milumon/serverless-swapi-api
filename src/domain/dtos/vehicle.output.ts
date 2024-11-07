import { VehicleModel } from '../../types/vehicle.types';

export class VehicleOutput implements VehicleModel {
  constructor(
    public id: string,
    public nombre: string,
    public modelo: string,
    public clase_vehiculo: string,
    public fabricante: string,
    public longitud: string,
    public costo_en_creditos: string,
    public tripulacion: string,
    public pasajeros: string,
    public velocidad_maxima: string,
    public capacidad_carga: string,
    public consumibles: string,
    public peliculas: string[],
    public pilotos: string[],
    public url: string,
    public creado: string,
    public editado: string
  ) {}
}
