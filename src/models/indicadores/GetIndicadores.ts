import { CommonResponseFields, RequiredParams } from "../ApiCommons";
import { Indicador } from "./Indicador";

export interface ParamsGetIndicadores extends RequiredParams {
  comercio_id: number[];
}

export interface RespuestaIndicadores extends CommonResponseFields{
    indicadores: Indicador[];
}