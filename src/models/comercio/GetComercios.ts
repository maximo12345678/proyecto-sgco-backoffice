import { CommonResponseFields, RequiredParams, Sortable } from '../ApiCommons';
import { Comercio } from './Comercio';

export interface ParamsGetComercios extends RequiredParams, Sortable {
  page: number;
  size: number;
  busqueda_avanzada: string;
}

export interface RespuestaGetComercios extends CommonResponseFields {
  comercios: Comercio[];
  totalElements: number;
  totalPages: number;
}
