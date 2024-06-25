import { Injectable } from '@angular/core';
import { ApiGetHistorialCaso, ApiKey } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParamsGetHistorialContracargo,
  RespuestaGetHistorialContracargo,
} from 'src/models/contracargos/HistorialContracargo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class HistorialCasoService extends ApiRequestWrapperService {
  async getHistorialCaso(
    params: ParamsGetHistorialContracargo
  ): Promise<RespuestaGetHistorialContracargo> {
    const url = ApiGetHistorialCaso.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi: RespuestaGetHistorialContracargo = {
      cantidad: 0,
      historialContracargos: [],
      message: '',
      status: ResponseStatus.unknown,
    };

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = { ...respuestaApi, ...data.body };
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
