import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {
  ApiAuthLogin,
  ApiAuthRefreshTokens,
  ApiKeyAuth,
} from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/ApiCommons';
import { Usuario, getDefaultUsuario } from 'src/models/Usuario';
import { RespuestaPostLogin } from 'src/models/login/PostLogin';
import {
  ParamsPostRefreshToken,
  RefreshTokenAuthResponse,
  RespuestaPostRefreshToken,
} from 'src/models/login/RefreshToken';

export interface AuthResponse {
  message: string;
  status: string;
  auth: Usuario | RefreshTokenAuthResponse;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly TOKEN_EXP_DELTA_SECONDS = 5;
  private apiKey = ApiKeyAuth.key;
  tokenExpired(idToken: string) {
    if (!idToken) {
      return true;
    }
    const decoded = jwtDecode(idToken);
    if (!decoded?.exp) {
      return true;
    }
    const expiration: number = decoded.exp;
    const currentTime: number = Math.floor(Date.now() / 1000); // Current time in seconds
    const hasExpired: boolean =
      expiration < currentTime + this.TOKEN_EXP_DELTA_SECONDS;

    return hasExpired;
  }

  private async sendPostRequest(
    url: string,
    params: any,
    respuestaApi: AuthResponse
  ) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'x-api-key': this.apiKey,
        },
      });
      const data = await response.json();
      const statusCode = response.status;
      if (statusCode !== 200 || !data.body) {
        respuestaApi.message =
          data.message ?? data.errorMessage ?? 'Error desconocido.';
        return respuestaApi;
      }
      respuestaApi.message = data.body.message;
      respuestaApi.auth = data.body.auth;
      respuestaApi.status = data.statusCode;
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }

  async loginFunction(
    username: string,
    password: string
  ): Promise<RespuestaPostLogin> {
    const url = ApiAuthLogin.apiUrl;
    let objParametro = {
      username: username,
      password: password,
    };
    let respuestaApi: RespuestaPostLogin = {
      auth: getDefaultUsuario(),
      message: '',
      status: '',
    };
    let resp = (await this.sendPostRequest(
      url,
      objParametro,
      respuestaApi
    )) as RespuestaPostLogin;
    return resp;
  }

  async refreshToken(
    params: ParamsPostRefreshToken
  ): Promise<RespuestaPostRefreshToken> {
    const url = ApiAuthRefreshTokens.apiUrl;

    let respuestaApi: RespuestaPostRefreshToken = {
      message: '',
      auth: { expires_in: '', id_token: '' },
      status: ResponseStatus.ok,
    };

    let resp = (await this.sendPostRequest(
      url,
      params,
      respuestaApi
    )) as RespuestaPostRefreshToken;
    return resp;
  }
}
