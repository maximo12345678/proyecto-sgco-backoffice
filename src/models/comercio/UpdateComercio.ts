import { RequiredParams } from "../ApiCommons";

export interface ParamsUpdateComercios extends RequiredParams {
  comercio_ids: number[];
  montos_minimos: number[];
  debitos_iniciales: boolean[];
}

export interface RespuestaUpdateComercios{
  status: string;
  message: string;
}