import { CommonResponseFields } from "../ApiCommons";

export interface ParamsPostRefreshToken{
  user_name: string;
  refresh_token: string;
}

export interface RefreshTokenAuthResponse {
  id_token: string;
  expires_in: string;
}

export interface RespuestaPostRefreshToken extends CommonResponseFields{
  auth: RefreshTokenAuthResponse;
}