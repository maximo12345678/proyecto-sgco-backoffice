import { Injectable } from '@angular/core';
import { ApiGetCriteriosValidacion, ApiKey } from 'src/environments/ApisUrls';
import {
  ParamsGetCriteriosCbk,
  RespuestaGetCriteriosCbk,
  getDefaultRespuestaCriteriosCbk,
} from 'src/models/criterios-validacion/GetCriteriosContracargo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CriteriosValidacionService extends ApiRequestWrapperService {
  async getCriteriosValidacionCbk(
    params: ParamsGetCriteriosCbk
  ): Promise<RespuestaGetCriteriosCbk> {
    const url = ApiGetCriteriosValidacion.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi = getDefaultRespuestaCriteriosCbk();

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }

      respuestaApi.status = data.statusCode;
      respuestaApi.criterioValidacion = data.body.CriterioValidacion;
      respuestaApi.grupoMcc = data.body.grupoMcc ?? '';
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
