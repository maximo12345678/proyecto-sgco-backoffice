import { CommonResponseFields, RequiredParams, ResponseStatus } from '../ApiCommons';
import { CriterioValidacion } from './CriterioValidacion';

export interface ParamsGetCriteriosCbk extends RequiredParams {
  contracargo_id: number;
}

export interface RespuestaGetCriteriosCbk extends CommonResponseFields {
  criterioValidacion: CriterioValidacion[];
  grupoMcc: string;
}

const defaultRespuestaCriteriosCbk: RespuestaGetCriteriosCbk = {
  status: ResponseStatus.unknown,
  message: '',
  criterioValidacion: [],
  grupoMcc: ''
};

export function getDefaultRespuestaCriteriosCbk(): RespuestaGetCriteriosCbk {
  return defaultRespuestaCriteriosCbk;
}
