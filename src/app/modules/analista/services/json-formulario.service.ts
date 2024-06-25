import { Injectable } from '@angular/core';
import { ApiGetJsonFormulario, ApiKey } from 'src/environments/ApisUrls';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

//TODO: interface respuesta

@Injectable({
  providedIn: 'root',
})
export class JsonFormularioService extends ApiRequestWrapperService {
  async getJsonFormulario(params: any): Promise<any> {
    const url = ApiGetJsonFormulario.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi = {} as any;

    try {
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
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
