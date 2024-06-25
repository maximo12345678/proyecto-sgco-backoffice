import { Injectable } from '@angular/core';
import {
  ApiGetContracargosDescargaCsv,
  ApiKey,
} from 'src/environments/ApisUrls';
import { ParamsGetContracargo } from 'src/models/contracargos/GetContracargo';
import { RespuestaPostDescargaCsv } from 'src/models/contracargos/PostDescargaCsv';
import { ApiRequestWrapperService } from './api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class DescargaCsvService extends ApiRequestWrapperService {
  async descargarCbks(
    params: ParamsGetContracargo
  ): Promise<RespuestaPostDescargaCsv> {
    const url = ApiGetContracargosDescargaCsv.apiUrl;
    const apiKey = ApiKey.key;

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    let respuestaApi: RespuestaPostDescargaCsv = {
      body: '',
      message: '',
    };

    try {
      
      const { data, apiError } = await this.fetchPost(url, apiKey, filteredParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }

      respuestaApi.message = 'ok';
      respuestaApi.body = data.body;
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}
