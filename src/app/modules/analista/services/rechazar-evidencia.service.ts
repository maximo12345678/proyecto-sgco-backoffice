import { Injectable } from '@angular/core';
import { ApiKey, ApiPostRechazarEvidencia } from 'src/environments/ApisUrls';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

//TODO: crear interfaces

@Injectable({
  providedIn: 'root',
})
export class RechazarEvidenciaService extends ApiRequestWrapperService {
  async postRechazarEvidencia(params: any): Promise<any> {
    const url = ApiPostRechazarEvidencia.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: any = {};

    try {
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }

      respuestaApi = data;
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
