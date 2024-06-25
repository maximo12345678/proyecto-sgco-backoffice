export interface Usuario {
  nombre: string;
  email: string;
  id_token: string;
  refresh_token: string;
  // access_token: string;
  usuario_id: number;
  rol_id: number;
  user_name: string;
  expires_in: string;
}

const defaultUser: Usuario = {
  nombre: '',
  id_token: '',
  usuario_id: 0,
  rol_id: 0,
  email: '',
  refresh_token: '',
  user_name: '',
  expires_in: '',
};

export function getDefaultUsuario(): Usuario {
  return defaultUser;
}
