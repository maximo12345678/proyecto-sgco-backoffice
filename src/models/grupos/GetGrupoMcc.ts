// esto deberia generico para cualquier get con paginacion
import { CommonResponseFields, RequiredParams, ResponseStatus, Sortable } from '../ApiCommons';
import { GrupoMcc } from './GrupoMcc';

export interface ParamsGetGruposMcc extends RequiredParams, Sortable {
  page: number;
  size: number;
  busqueda_avanzada: string;
}
// viene con guion bajo desde backend
export interface GrupoMccList {
  grupoMcc: GrupoMcc;
  cantidad_criterios: number;
}

export interface RespuestaGrupoMcc extends CommonResponseFields {
  totalPages: number;
  totalItems: number;
  grupoMccList: GrupoMccList[];
}

const defaultGrupoMccList: GrupoMccList = {
  cantidad_criterios: 0,
  grupoMcc: {
    id: 0,
    codigoMcc: 0,
    descripcion: '',
    createdAt: '',
    deletedAt: null,
    updatedAt: null,
  },
};

const defaultRespuestaGrupoMcc: RespuestaGrupoMcc = {
  totalPages: 0,
  totalItems: 0,
  grupoMccList: [],
  status: ResponseStatus.unknown,
  message: '',
};

export function getDefaultGrupoMccList() {
  return defaultGrupoMccList;
}

export function getDefaultRespuestaGrupoMcc() {
  return defaultRespuestaGrupoMcc;
}
