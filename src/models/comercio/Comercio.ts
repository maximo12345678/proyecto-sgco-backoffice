export interface Comercio {
  id: number;
  nombre: string;
  montoMinimo: number;
  tieneSubcomercio: boolean;
  debitoInicial: boolean;
}

const defaultComercio: Comercio = {
  debitoInicial: false,
  id: 0,
  montoMinimo: 0,
  nombre: '',
  tieneSubcomercio: false,
};

export function getDefaultComercio(): Comercio {
  return defaultComercio;
}
