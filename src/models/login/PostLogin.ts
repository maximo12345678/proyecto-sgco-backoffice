import { Usuario } from "../Usuario";

export interface ParamsPostLogin{
  usuario: string;
  password: string;
}

export interface RespuestaPostLogin{
  status: string;
  message: string;
  auth: Usuario;
}