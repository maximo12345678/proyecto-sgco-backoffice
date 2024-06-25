import { CommonResponseFields, RequiredParams } from "../ApiCommons";

export interface EvidenciaFile {
    name: string;
    file_type: string;
    data: string;
  }

export interface ParametroPostEvidencia  extends RequiredParams {
  contracargo_id: number;
  etapa_id: number;
  observacion: string;
  files: EvidenciaFile[];
}

export interface RespuestaPostEvidencia extends CommonResponseFields{
  file_key: string;
}


