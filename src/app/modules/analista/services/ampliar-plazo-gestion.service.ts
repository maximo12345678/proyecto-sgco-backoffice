import { Injectable } from '@angular/core';
import { ApiKey, ApiPostAmpliarPlazoGestion } from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AmpliarPlazoGestionService extends ApiRequestWrapperService {
  async postAmpliarPlazoGestion(params: any): Promise<any> {
    const url = ApiPostAmpliarPlazoGestion.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi = {
      message: '',
      status: ResponseStatus.unknown,
    };
    
    try {
      
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message;
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
