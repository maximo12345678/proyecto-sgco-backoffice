import {
  CommonResponseFields,
  RequiredParams,
  ResponseStatus,
  Sortable,
} from '../ApiCommons';
import { Motivo } from './Motivo';

export interface ParamsGetMotivos extends RequiredParams, Sortable {
  aprobado?: boolean;
  page: number;
  size: number;
  marca_id?: number;
  busqueda_avanzada: string;
}

export interface RespuestaGetMotivos extends CommonResponseFields {
  total_elements: number;
  total_pages: number;
  data: Motivo[];
}

const defaultRespuestaGetMotivos: RespuestaGetMotivos = {
  data: [],
  message: '',
  total_elements: 0,
  total_pages: 0,
  status: ResponseStatus.unknown,
};

export function getDefaultRespuestaGetMotivos() {
  return defaultRespuestaGetMotivos;
}
