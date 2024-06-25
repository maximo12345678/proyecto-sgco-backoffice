export interface Filtro {
    id: number;
    nombre: string;
    opciones: {};
}


export interface Selectable {
  selected: boolean;
}

export interface FiltroMarca extends Selectable {
  id: number;
  text: string;
  visibleText?: string;
}

export interface FiltroEtapa extends Selectable {
  id: number;
  idMarca: number;
  text: string;
  visibleText?: string;
}

export interface FiltroEstado extends Selectable {
  id: number;
  idMarca: number;
  idEtapa: number;
  text: string;
  visibleText?: string;
}

export interface FiltroEstadoMotivo extends Selectable {
  id: number;
  text: string;
  visibleText?: string;
}

export interface FilterSelection {
  marcas: number[];
  etapas: number[];
  estados: number[];
}

export interface MotivoFilterSelection {
  marcas: number[];
  estados: number[];
}


export interface FiltroCbkConfig{
  marcas: FiltroMarca[];
  etapas: FiltroEtapa[];
  estados: FiltroEstado[];
  marcaMap: { [id: number]: string }
  etapaMap: { [id: number]: string }
}