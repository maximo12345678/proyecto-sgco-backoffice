export interface RequiredParams {
  usuario_id?: number;
  rol_id?: number;
}

export interface Sortable {
  sort?: string;
  order?: string;
}

export interface ApiAuthData {
  usuario_id: number;
  rol_id: number;
  id_token: string;
}

export enum ResponseStatus {
  ok = 'OK',
  internalError = 'INTERNAL_SERVER_ERROR',
  authorizationError = 'AUTHORIZATION_ERROR',
  unknownError = 'UNKNOWN_ERROR',
  unknown = '',
}

export interface CommonResponseFields {
  message: string;
  status: ResponseStatus;
}
