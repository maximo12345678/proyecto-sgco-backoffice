import { CommonResponseFields, RequiredParams } from "../ApiCommons";
import { AlertasEstados, AlertasMotivos } from "./Alerta";

export interface ParamsGetAlertas extends RequiredParams {
}

export interface RespuestaAlertasAnalista extends CommonResponseFields{
    alertas_estados: AlertasEstados;
}

export interface RespuestaAlertasAdmin extends RespuestaAlertasAnalista{
    alertas_motivos: AlertasMotivos;
}