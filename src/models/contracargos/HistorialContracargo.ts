import { CommonResponseFields, RequiredParams } from '../ApiCommons';

export interface HistorialContracargo {
  id: number;
  fechaContracargo: string;
  etapa: string;
  estado: string;
  estadoDescripcion: string;
  usuario: string;
}

export interface ParamsGetHistorialContracargo extends RequiredParams {
  contracargo_id: number;
}

export interface RespuestaGetHistorialContracargo extends CommonResponseFields {
  cantidad: number;
  historialContracargos: HistorialContracargo[];
}
