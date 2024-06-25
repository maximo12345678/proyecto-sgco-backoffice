import { EstadosSGCO } from 'src/app/constants';
import {
  ESTADO_POR_APROBAR_ID
} from 'src/app/modules/comunes/filtros/filtros-motivo/filter-data';

export interface AlertasEstados {
  por_pre_arbitrar_visa: number;
  motivos_no_encontrados: number;
  pendientes_por_abonar: number;
  pendientes_por_cerrar: number;
  por_arbitrar_visa: number;
  por_disputar_mastercard: number;
  por_pre_arbitrar_mastercard: number;
  arbitraje_resuelto_visa: number;
  pendientes_por_gestionar: number;
  notificados_no_gestionados: number;
}

const defaultAlertasEstados: AlertasEstados = {
  por_pre_arbitrar_visa: 0,
  motivos_no_encontrados: 0,
  pendientes_por_abonar: 0,
  pendientes_por_cerrar: 0,
  por_arbitrar_visa: 0,
  por_disputar_mastercard: 0,
  por_pre_arbitrar_mastercard: 0,
  arbitraje_resuelto_visa: 0,
  pendientes_por_gestionar: 0,
  notificados_no_gestionados: 0
};

export function getDefaultAlertasEstados(): AlertasEstados {
  return { ...defaultAlertasEstados };
}

export interface AlertasMotivos {
  motivos_por_aprobar: number;
}

const defaultAlertasMotivos: AlertasMotivos = {
  motivos_por_aprobar: 0,
};

export function getDefaultAlertasMotivos(): AlertasMotivos {
  return { ...defaultAlertasMotivos };
}

export const AlertaKeyIdMap: { [id: string]: number } = {
  por_pre_arbitrar_visa: 1,
  motivos_no_encontrados: 2,
  pendientes_por_abonar: 3,
  pendientes_por_cerrar: 4,
  por_arbitrar_visa: 5,
  por_disputar_mastercard: 6,
  por_pre_arbitrar_mastercard: 7,
  motivos_por_aprobar: 8,
  arbitraje_resuelto_visa: 9,
  pendientes_por_gestionar: 10,
  notificados_no_gestionados: 11,
};

export enum AlertasElementId {
  PorPreArbitrarVisa = 1,
  MotivosNoEncontrados = 2,
  PendientesPorAbonar = 3,
  PendientesPorCerrar = 4,
  PorArbitrarVisa = 5,
  PorDisputarMastercard = 6,
  PorPreArbitrarMastercard = 7,
  MotivosPorAprobar = 8,
  ArbitrajeResueltoVisa = 9,
  PendientesPorGestionar = 10,
  NotificadosNoGestionados = 11,
}

export const AlertaEstadoIds: { [id: number]: number[] } = {
  [AlertasElementId.PorPreArbitrarVisa]: [
    EstadosSGCO.PRE_ARBITRAJE_VISA_POR_PRE_ARBITRAR,
  ],
  [AlertasElementId.MotivosNoEncontrados]: [
    EstadosSGCO.CONTRACARGO_VISA_MOTIVO_NO_ENCONTRADO,
    EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_NO_ENCONTRADO,
  ],
  [AlertasElementId.PendientesPorAbonar]: [
    EstadosSGCO.ARBITRAJE_MASTERCARD_POR_ABONAR,
    EstadosSGCO.DISPUTA_MASTERCARD_POR_ABONAR,
    EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_POR_ABONAR,
    EstadosSGCO.PRE_ARBITRAJE_VISA_POR_ABONAR,
    EstadosSGCO.ARBITRAJE_VISA_POR_ABONAR,
  ],
  [AlertasElementId.PendientesPorCerrar]: [
    EstadosSGCO.CONTRACARGO_MASTERCARD_CIERRE_PROGRAMADO,
    EstadosSGCO.DISPUTA_MASTERCARD_CIERRE_PROGRAMADO,
    EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_CIERRE_PROGRAMADO,
    EstadosSGCO.ARBITRAJE_MASTERCARD_CIERRE_PROGRAMADO,
    EstadosSGCO.CONTRACARGO_VISA_CIERRE_PROGRAMADO,
    EstadosSGCO.PRE_ARBITRAJE_VISA_CIERRE_PROGRAMADO,
    EstadosSGCO.ARBITRAJE_VISA_CIERRE_PROGRAMADO,
  ],
  [AlertasElementId.PorArbitrarVisa]: [EstadosSGCO.ARBITRAJE_VISA_POR_ARBITRAR],
  [AlertasElementId.PorDisputarMastercard]: [
    EstadosSGCO.DISPUTA_MASTERCARD_POR_DISPUTAR,
  ],
  [AlertasElementId.PorPreArbitrarMastercard]: [
    EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_POR_PRE_ARBITRAR,
  ],
  [AlertasElementId.MotivosPorAprobar]: [
    EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_POR_APROBAR,
    EstadosSGCO.CONTRACARGO_VISA_MOTIVO_POR_APROBAR,
  ],
  [AlertasElementId.ArbitrajeResueltoVisa]: [
    EstadosSGCO.ARBITRAJE_VISA_RESUELTO
  ],
  [AlertasElementId.PendientesPorGestionar]: [
    EstadosSGCO.CONTRACARGO_VISA_POR_GESTIONAR,
    EstadosSGCO.CONTRACARGO_MASTERCARD_POR_GESTIONAR,
    EstadosSGCO.ARBITRAJE_VISA_POR_GESTIONAR,
    EstadosSGCO.ARBITRAJE_MASTERCARD_POR_GESTIONAR,
  ],
  [AlertasElementId.NotificadosNoGestionados]: [
    EstadosSGCO.CONTRACARGO_MASTERCARD_NO_GESTIONADO_ACEPTADO,
    EstadosSGCO.CONTRACARGO_VISA_NO_GESTIONADO_ACEPTADO,
  ],
};

// aplicar el filtro motivos por aprobar en la vista motivos
export const AlertaMotivosIds: { [id: number]: number[] } = {
  [AlertasElementId.MotivosPorAprobar]: [ESTADO_POR_APROBAR_ID],
};
