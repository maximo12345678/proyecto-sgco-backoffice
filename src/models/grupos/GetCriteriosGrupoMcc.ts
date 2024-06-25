import { RequiredParams } from "../ApiCommons";
import { CriterioValidacion } from "../criterios-validacion/CriterioValidacion";

export interface ParamsGetCriteriosGrupo  extends RequiredParams {
  grupo_mcc_id: number;
}

export interface RespuestaGetCriteriosGrupo {
  criterios: CriterioValidacion[];
  message: string;
  status: string;
}