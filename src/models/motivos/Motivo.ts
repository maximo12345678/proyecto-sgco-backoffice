export interface Motivo {
  descripcion: string;
  nombre_marca: string;
  id_marca: number;
  id_motivo: number;
  codigo_motivo: string;
  usuario_aprobador_id: number | null;
  gestiona_analista: boolean;
  dias_transaccion_no_mayor_a: number;
  fecha_aprobacion: string | null;
  presentacion_tardia: boolean | null;
  estado: string;
}

const defaultMotivo: Motivo = {
  descripcion: "",
  id_motivo: 0,
  codigo_motivo: "",
  usuario_aprobador_id: null,
  gestiona_analista: false,
  dias_transaccion_no_mayor_a: 0,
  fecha_aprobacion: null,
  presentacion_tardia: null,
  estado: "",
  nombre_marca: "",
  id_marca: 0
}

export function getDefaultMotivo(): Motivo {
  return defaultMotivo;
}