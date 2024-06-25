import { Injectable } from '@angular/core';
import { ApiCambioEstado, ApiKey } from 'src/environments/ApisUrls';
import { ParamsCambioEstado } from 'src/models/contracargos/CambioEstado';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

// TODO:interface respuesta
@Injectable({
  providedIn: 'root',
})
export class CambioEstadoService extends ApiRequestWrapperService {
  async putCambioEstado(params: ParamsCambioEstado): Promise<any> {
    const url = ApiCambioEstado.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: any = {};

    try {
      const { data, apiError } = await this.fetchPut(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = data.body;
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}
