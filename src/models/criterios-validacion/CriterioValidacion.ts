import { GrupoMcc } from "../grupos/GrupoMcc";

export interface CriterioValidacion {
  id: number;
  descripcion: string;
  obligatorio: boolean;
  grupoMcc: GrupoMcc;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}