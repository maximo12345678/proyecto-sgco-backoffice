import { RequiredParams } from "../ApiCommons";
import { CriterioValidacion } from "./CriterioValidacion";

export interface ParamsPostCriteriosValidacion extends RequiredParams {
  grupo_mcc_id: number;
  descripcion: string[];
  obligatorio: boolean[];
}

export interface RespuestaPostCriteriosValidacion {
  criterios: CriterioValidacion[];
  message: string;
  status: string;
}