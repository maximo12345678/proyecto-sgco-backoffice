export interface ConfigContador {
  id: number;
  nombre: string;
  diasMaximos: number;
  idEtapa: number;
  etapa: string;
  idMarca: number;
  marca: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
