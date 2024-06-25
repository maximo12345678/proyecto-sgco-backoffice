import { Injectable } from '@angular/core';
import { ApiKey, ApiPostJsonFormulario } from 'src/environments/ApisUrls';
import { PostOpcionEtapaParams } from 'src/models/opcion-etapa/PostOpcionEtapa';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

//TODO: interfaces...

@Injectable({
  providedIn: 'root',
})
export class EnviarJsonFormularioService extends ApiRequestWrapperService {
  async postJsonFormulario(params: PostOpcionEtapaParams): Promise<any> {
    const url = ApiPostJsonFormulario.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: any = {};

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
