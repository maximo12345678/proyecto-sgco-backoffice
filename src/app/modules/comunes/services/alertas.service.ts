import { Injectable } from '@angular/core';
import {
  ApiGetAlertasAdmin,
  ApiGetAlertasAnalista,
  ApiKey,
} from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  getDefaultAlertasEstados,
  getDefaultAlertasMotivos,
} from 'src/models/alertas/Alerta';
import {
  ParamsGetAlertas,
  RespuestaAlertasAdmin,
  RespuestaAlertasAnalista,
} from 'src/models/alertas/GetAlertas';
import { ApiRequestWrapperService } from './api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AlertasService extends ApiRequestWrapperService {
  private async getAlertas(params: ParamsGetAlertas, url: string) {
    const apiKey = ApiKey.key;
    const urlParams = new URLSearchParams(Object(params)).toString();
    let finalResponse = { data: undefined as any, statusCode: 500 };

    try {
      
      const { data, apiError, statusCode } = await this.fetchGet(
        url,
        apiKey,
        urlParams
      );
      if (apiError) {
        return finalResponse;
      }
      finalResponse.data = data;
      finalResponse.statusCode = statusCode;
    } catch (error) {
      console.error('Error:', error);
    }
    return finalResponse;
  }

  async getAlertasAdmin(
    params: ParamsGetAlertas
  ): Promise<RespuestaAlertasAdmin> {
    const url = ApiGetAlertasAdmin.apiUrl;
    const { data, statusCode } = await this.getAlertas(params, url);
    let respuestaApi: RespuestaAlertasAdmin = {
      alertas_estados: getDefaultAlertasEstados(),
      alertas_motivos: getDefaultAlertasMotivos(),
      message: '',
      status: ResponseStatus.unknown,
    };
    if (statusCode !== 200 || !data) {
      respuestaApi.message = `Ocurrio un error al realizar la solicitud (statusCode ${statusCode})`;
    } else {
      respuestaApi.alertas_estados = data.body.alertas_estados;
      respuestaApi.alertas_motivos = data.body.alertas_motivos;
    }
    return respuestaApi;
  }

  async getAlertasAnalista(
    params: ParamsGetAlertas
  ): Promise<RespuestaAlertasAnalista> {
    const url = ApiGetAlertasAnalista.apiUrl;
    const { data, statusCode } = await this.getAlertas(params, url);
    let respuestaApi: RespuestaAlertasAnalista = {
      alertas_estados: getDefaultAlertasEstados(),
      message: '',
      status: ResponseStatus.unknown,
    };
    if (statusCode !== 200 || !data) {
      respuestaApi.message = `Ocurrio un error al realizar la solicitud (statusCode ${statusCode})`;
    } else {
      respuestaApi.alertas_estados = data.body.alertas_estados;
    }
    return respuestaApi;
  }
}
