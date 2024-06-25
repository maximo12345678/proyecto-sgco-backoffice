import { CommonResponseFields, RequiredParams, Sortable } from "../ApiCommons";
import { Contracargo } from "./Contracargo";

export interface ParamsGetContracargo extends RequiredParams, Sortable {
    marcas: number[];
    estados: number[];
    etapas: number[];
    fecha_desde: string;
    fecha_hasta: string;
    page: number;
    ultimos_dias?: number;
    busqueda_avanzada: string;
}

export interface RespuestaContracargos extends CommonResponseFields {
    contracargos: Contracargo[]
    curPage: number
    pageSize: number
    total: number
}