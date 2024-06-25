import { Injectable } from '@angular/core';
import { ApiKey, ApiPutMotivoAnalista } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParamsPutMotivo,
  RespuestaPutMotivo,
} from 'src/models/motivos/PutMotivo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class MotivosService  extends ApiRequestWrapperService{
  async putMotivo(params: ParamsPutMotivo): Promise<RespuestaPutMotivo> {
    const url = ApiPutMotivoAnalista.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaPutMotivo = {
      message: '',
      status: ResponseStatus.unknown,
    };

    params.gestion_analista = params.gestiona_analista;

    try {
      
      const { data, apiError } = await this.fetchPut(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }

      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message;
      
    } catch (error) {
      console.error('Error:', error);
      respuestaApi.message = String(error);
    }
    return respuestaApi;
  }
}
