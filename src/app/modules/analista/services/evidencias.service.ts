import { Injectable } from '@angular/core';
import { ApiGetEvicenciaPath, ApiKey, ApiPostEvicencia } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParametroGetEvidencia,
  RespuestaGetEvidencia,
} from 'src/models/evidencia/GetEvidencia';
import { ParametroPostEvidencia, RespuestaPostEvidencia } from 'src/models/evidencia/PostEvidencia';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class EvidenciasService extends ApiRequestWrapperService {
  async getEvidencia(
    params: ParametroGetEvidencia
  ): Promise<RespuestaGetEvidencia> {
    const url = ApiGetEvicenciaPath.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi: RespuestaGetEvidencia = {
      message: '',
      status: ResponseStatus.unknown,
      body: {
        etapa_id: 0,
        usuario_id: 0,
        s3_path: '',
        contracargo_id: 0,
        documento: [],
      },
    };

    try {
      
      const res = await this.fetchGet(url, apiKey, urlParams);
      const { data, apiError } = res;
      if (apiError) {
        return {...respuestaApi ,...apiError}
      }

      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message;
      respuestaApi.body = data.body;
      
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }

  async createEvidence(params: ParametroPostEvidencia ): Promise<RespuestaPostEvidencia> {

    const url = ApiPostEvicencia.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaPostEvidencia = {
      message: "",
      status: ResponseStatus.unknown,
      file_key: "",
    };

    try {
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message ?? data.body.message_code;
      respuestaApi.file_key = data.body.file_key;
      
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
