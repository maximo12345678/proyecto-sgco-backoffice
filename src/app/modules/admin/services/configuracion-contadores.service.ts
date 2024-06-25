import { Injectable } from '@angular/core';
import {
  ApiGetConfiguracionContadores,
  ApiKey,
  ApiUpdateConfiguracionContadores,
} from 'src/environments/ApisUrls';
import {
  ParamsGetConfigContadores,
  RespuestaConfigContadores,
  getDefaultRespuestaConfigContadores,
} from 'src/models/configuraciones/GetConfiguracionesContadores';
import { ParamsPutConfigContadores } from 'src/models/configuraciones/PutConfiguracionesContadores';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionContadoresService extends ApiRequestWrapperService {
  async getConfigContadores(
    params: ParamsGetConfigContadores
  ): Promise<RespuestaConfigContadores> {
    const url = ApiGetConfiguracionContadores.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi = getDefaultRespuestaConfigContadores();

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.contadores = data.body.contadores;
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }

  async updateConfigContadores(
    params: ParamsPutConfigContadores
  ): Promise<RespuestaConfigContadores> {
    const url = ApiUpdateConfiguracionContadores.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi = getDefaultRespuestaConfigContadores();

    try {
      
      const { data, apiError } = await this.fetchPut(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.contadores = data.body.contadores;
      
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}