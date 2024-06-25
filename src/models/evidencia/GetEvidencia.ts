import { CommonResponseFields, RequiredParams } from "../ApiCommons";

export interface ParametroGetEvidencia  extends RequiredParams {
  etapa_id: number;
  contracargo_id: number;
}

export interface DocumentoGetEvidencia {
  file_name: string;
  file_type: string;
  file_data: string;
}

export interface RespuestaGetEvidencia extends CommonResponseFields{
  body: {
    etapa_id: number;
    usuario_id: number;
    s3_path: string;
    contracargo_id: number;
    documento: DocumentoGetEvidencia[];
  };
}
