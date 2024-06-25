import { Injectable } from '@angular/core';
import { ApiGetListaComercios, ApiKey, ApiPutUpdateComercios } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  ParamsGetComercios,
  RespuestaGetComercios,
} from 'src/models/comercio/GetComercios';
import { ParamsUpdateComercios, RespuestaUpdateComercios } from 'src/models/comercio/UpdateComercio';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionComercioService extends ApiRequestWrapperService {

  async getComercios(
    params: ParamsGetComercios
  ): Promise<RespuestaGetComercios> {
    const url = ApiGetListaComercios.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi: RespuestaGetComercios = {
      message: '',
      status: ResponseStatus.unknown,
      comercios: [],
      totalElements: 0,
      totalPages: 0,
    };

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.comercios = data.body["Comercios"].content;
      respuestaApi.totalElements = data.body["Comercios"].totalElements;
      respuestaApi.totalPages = data.body["Comercios"].totalPages;
      
    } catch (error) {
      console.error('Error:', error);
      respuestaApi.message = String(error);
    }
    return respuestaApi;
  }

  async updateComercios(
    params: ParamsUpdateComercios
  ): Promise<RespuestaUpdateComercios> {
    const url = ApiPutUpdateComercios.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaUpdateComercios = {
      message: '',
      status: '',
    };

    try {
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.message = data.body.message;
      respuestaApi.status = data.statusCode;
      
    } catch (error) {
      console.error('Error:', error);
      respuestaApi.message = String(error);
    }
    return respuestaApi;
  }
}
