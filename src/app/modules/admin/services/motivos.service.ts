import { Injectable } from '@angular/core';
import {
  ApiGetMotivos,
  ApiKey,
  ApiPutMotivoAdmin,
} from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParamsGetMotivos,
  RespuestaGetMotivos,
} from 'src/models/motivos/GetMotivos';
import {
  ParametroPutMotivoAdmin,
  RespuestaPutMotivo,
} from 'src/models/motivos/PutMotivo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

//NOTA: usar getMotivos como muestra (extends ApiAuth... handleUnauthorized...)

@Injectable({
  providedIn: 'root',
})
export class MotivosService extends ApiRequestWrapperService {
  async getMotivos(params: ParamsGetMotivos): Promise<RespuestaGetMotivos> {
    const url = ApiGetMotivos.apiUrl;
    const apiKey = ApiKey.key;
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
    const urlParams = new URLSearchParams(filteredParams).toString();

    let respuestaApi: RespuestaGetMotivos = {
      message: '',
      status: ResponseStatus.unknown,
      data: [],
      total_elements: 0,
      total_pages: 0,
    };

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = { ...data.body, status: data.statusCode };
      
    } catch (error) {
      console.error('Error:', error);
      respuestaApi.message = String(error);
    }

    return respuestaApi;
  }

  async updateMotivo(
    params: ParametroPutMotivoAdmin
  ): Promise<RespuestaPutMotivo> {
    const url = ApiPutMotivoAdmin.apiUrl;
    const apiKey = ApiKey.key;

    // gigaparche
    params.gestion_analista = params.gestiona_analista;

    let respuestaApi: RespuestaPutMotivo = {
      message: '',
      status: ResponseStatus.unknown,
    };

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
