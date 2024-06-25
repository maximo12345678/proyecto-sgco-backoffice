import { Injectable } from '@angular/core';
import { ApiGetIndicadores, ApiKey } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParamsGetIndicadores,
  RespuestaIndicadores,
} from 'src/models/indicadores/GetIndicadores';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class IndicadoresService extends ApiRequestWrapperService {
  async getIndicadores(
    params: ParamsGetIndicadores
  ): Promise<RespuestaIndicadores> {
    const url = ApiGetIndicadores.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi: RespuestaIndicadores = {
      indicadores: [],
      message: '',
      status: ResponseStatus.unknown,
    };

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.indicadores = data.body.indicadores.detalles;
      respuestaApi.message = data.body.message;
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}