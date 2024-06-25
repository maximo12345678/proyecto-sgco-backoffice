import { Injectable } from '@angular/core';
import { ApiGetContracargos, ApiKey } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParamsGetContracargo,
  RespuestaContracargos,
} from 'src/models/contracargos/GetContracargo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContracargosService extends ApiRequestWrapperService {
  async getContracargos(
    params: ParamsGetContracargo
  ): Promise<RespuestaContracargos> {
    const url = ApiGetContracargos.apiUrl;
    const apiKey = ApiKey.key;
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
    const urlParams = new URLSearchParams(filteredParams).toString();

    let respuestaApi: RespuestaContracargos = {
      contracargos: [],
      curPage: 0,
      message: '',
      pageSize: 0,
      total: 0,
      status: ResponseStatus.unknown,
    };

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = data.body;
      respuestaApi.status = data.statusCode;

      if (respuestaApi == null || data.body.error) {
        respuestaApi = {
          contracargos: [],
          curPage: 0,
          message: data.body.error ?? 'Error: La respuesta de la api vino en NULL.',
          pageSize: 0,
          total: 0,
          status: ResponseStatus.internalError,
        };
      } 
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
