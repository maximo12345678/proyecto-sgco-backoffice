import { RequiredParams } from "../ApiCommons";

export interface PostOpcionEtapaParams extends RequiredParams{
  contracargo_id: number;
  id_interno_marca: number;
  etapa_id: number;
  marca_id: number;
  motivo_id: number;
  opcion_portal_id: number;
  opciones_json: any;
}