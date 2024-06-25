import { RequiredParams } from '../ApiCommons';

export interface ParamsCambioEstado extends RequiredParams {
  // Para todos los cambios de estado se enviara este objeto como parametro a la api.
  contracargo_id: number; // este es el ID del caso al cual se le modificara el estado.
  estado_final: number;
}

// falta probar...
export interface ResultadoCambioEstado {
  statusCode: string;
  body: {
    message: string;
  };
}
