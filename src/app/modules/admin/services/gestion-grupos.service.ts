import { Injectable } from '@angular/core';
import {
  ApiGetGruposMcc,
  ApiGetiCriterioValidacionById,
  ApiKey,
  ApiPostCriteriosValidacion,
} from 'src/environments/ApisUrls';
import {
  ParamsPostCriteriosValidacion,
  RespuestaPostCriteriosValidacion,
} from 'src/models/criterios-validacion/PostCriterioValidacion';
import {
  ParamsGetCriteriosGrupo,
  RespuestaGetCriteriosGrupo,
} from 'src/models/grupos/GetCriteriosGrupoMcc';
import {
  ParamsGetGruposMcc,
  RespuestaGrupoMcc,
  getDefaultRespuestaGrupoMcc,
} from 'src/models/grupos/GetGrupoMcc';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class GestionGruposService extends ApiRequestWrapperService {
  async getGruposMcc(params: ParamsGetGruposMcc): Promise<RespuestaGrupoMcc> {
    const url = ApiGetGruposMcc.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi = getDefaultRespuestaGrupoMcc();

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message;
      respuestaApi.totalItems = data.body.totalPages;
      respuestaApi.grupoMccList = data.body.list.map((ele: any) => {
        return { grupoMcc: ele.grupo_mcc, cantidad_criterios: ele.data };
      });
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }

  async postCriteriosValidacion(
    params: ParamsPostCriteriosValidacion
  ): Promise<RespuestaPostCriteriosValidacion> {
    const url = ApiPostCriteriosValidacion.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaPostCriteriosValidacion = {
      criterios: [],
      message: '',
      status: '',
    };

    try {
      
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      if (data.statusCode === 'OK') {
        respuestaApi.criterios = data.body['CriterioValidacion'];
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message;
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }

  async getCriteriosGrupo(
    params: ParamsGetCriteriosGrupo
  ): Promise<RespuestaGetCriteriosGrupo> {
    const url = ApiGetiCriterioValidacionById.apiUrl;
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi: RespuestaGetCriteriosGrupo = {
      criterios: [],
      message: '',
      status: '',
    };

    try {
      
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }

      if (data.statusCode === 'OK') {
        respuestaApi.criterios = data.body.criterioValidacion;
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message;
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
