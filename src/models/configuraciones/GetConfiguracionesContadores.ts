import { CommonResponseFields, RequiredParams, ResponseStatus } from '../ApiCommons';
import { ConfigContador } from './ConfiguracionContador';

export interface RespuestaConfigContadores extends CommonResponseFields {
  contadores: ConfigContador[];
}

export interface ParamsGetConfigContadores extends RequiredParams {
  marca_id: number;
}

const defaultRespuestaConfigContadores: RespuestaConfigContadores = {
  status: ResponseStatus.unknown,
  message: '',
  contadores: [],
};

export function getDefaultRespuestaConfigContadores(): RespuestaConfigContadores {
  return defaultRespuestaConfigContadores;
}
