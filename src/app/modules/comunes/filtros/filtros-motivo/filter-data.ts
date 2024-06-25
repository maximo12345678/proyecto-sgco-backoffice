import {
  FiltroEstadoMotivo,
  FiltroMarca
} from 'src/models/filtros/Filtro';

export const MARCAS: FiltroMarca[] = [
  { id: 1, text: 'MASTERCARD', selected: false },
  { id: 2, text: 'VISA', selected: false },
];

export const ESTADO_APROBADO_ID = 1;
export const ESTADO_POR_APROBAR_ID = 2;

export const ESTADOS: FiltroEstadoMotivo[] = [
  { id: ESTADO_APROBADO_ID, text: 'Aprobado', selected: false },
  { id: ESTADO_POR_APROBAR_ID, text: 'Por Aprobar', selected: false },
];
