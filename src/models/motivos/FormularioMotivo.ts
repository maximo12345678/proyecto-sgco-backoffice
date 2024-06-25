export interface FormularioMotivo {
  presentacion_tardia: boolean | null;
  gestiona_analista: boolean | null;
  descripcion: string | null;
  dias_transaccion: number | null;
}

export const FORMULARIO_NUM_KEYS = 4;
const defaultFormularioMotivo: FormularioMotivo = {
  descripcion: null,
  dias_transaccion: null,
  gestiona_analista: null,
  presentacion_tardia: null,
};

export function getDefaultFormularioMotivo() {
  return defaultFormularioMotivo;
}
