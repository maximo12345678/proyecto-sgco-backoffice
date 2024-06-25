export interface Contracargo {
  caso: string;
  comercio: string;
  diasDesdeNotificacion: number;
  diasParaCierre: number;
  estado: string;
  estadoId: number;
  marca: string;
  marcaId: string;
  etapaDesc: string;
  etapaId: string;
  montoCbk: number;
  montoTrx: number;
  motivoDesc: string;
  motivoId: string;
  motivoCodigo: string;
  recepcion: string;
  subcomercio: string;
  fechaTransaccion: string;
  pagoComercio: number;

  rutComerio: string;
  terminalNumber: string;
  puedeExtenderPlazo: boolean;
  numeroTarjeta: string;
  arn: string;
  montoVenta: number;
  codigoMC: string;
}

const defaultContracargo: Contracargo = {
  caso: '',
  comercio: '',
  diasDesdeNotificacion: 0,
  diasParaCierre: 0,
  estado: '',
  estadoId: 0,
  marca: '',
  marcaId: '',
  etapaDesc: '',
  etapaId: '',
  montoCbk: 0,
  montoTrx: 0,
  motivoDesc: '',
  motivoId: '',
  motivoCodigo: '',
  recepcion: '',
  subcomercio: '',
  fechaTransaccion: '',
  pagoComercio: 0,
  rutComerio: '',
  terminalNumber: '',
  puedeExtenderPlazo: false,
  numeroTarjeta: '',
  arn: '',
  montoVenta: 0,
  codigoMC: '',
};

export function getDefaultContracargo(): Contracargo {
  return defaultContracargo;
}

