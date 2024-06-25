import { CommonResponseFields, RequiredParams } from "../ApiCommons";

export interface ParamsPutMotivo  extends RequiredParams  {
  motivo_id: number;
  marca_id: number;
  codigo_motivo: string,
  descripcion: string;
  gestiona_analista: boolean;
  gestion_analista?: boolean;
  dias_transaccion: number;
  presentacion_tardia: boolean;
}

export interface ParametroPutMotivoAdmin  extends ParamsPutMotivo{
  usuario_aprobador_id: number;
}
export interface RespuestaPutMotivo extends CommonResponseFields{
  // motivo: Motivo; // no viene
}
