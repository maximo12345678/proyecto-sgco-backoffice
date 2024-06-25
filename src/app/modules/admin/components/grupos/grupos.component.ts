import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  SortChangedEvent,
  SortIconDirective,
} from 'src/app/modules/comunes/directives/sort-icon.directive';
import { PaginationConfig } from 'src/app/modules/comunes/pagination/pagination.component';
import { ParamsPostCriteriosValidacion } from 'src/models/criterios-validacion/PostCriterioValidacion';
import { CriterioGrupoMcc } from 'src/models/grupos/CriterioGrupoMcc';
import { ParamsGetCriteriosGrupo } from 'src/models/grupos/GetCriteriosGrupoMcc';
import {
  GrupoMccList,
  ParamsGetGruposMcc,
  RespuestaGrupoMcc,
  getDefaultGrupoMccList,
  getDefaultRespuestaGrupoMcc,
} from 'src/models/grupos/GetGrupoMcc';
import { GestionGruposService } from '../../services/gestion-grupos.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
})
export class GruposComponent implements OnInit {
  constructor(private gestionGrupos: GestionGruposService) {}
  @ViewChildren(SortIconDirective)
  sortableDirectives!: QueryList<SortIconDirective>;

  async ngOnInit(): Promise<void> {
    this.loadingTablaGrupos = true;

    await this.traerGrupos();
    // mensaje de resultado dependiendo de la respusta de la api
    this.loadingTablaGrupos = false;
  }

  loadingTablaGrupos: boolean = false;
  mostrarModalGestionarCaso: boolean = false;
  cambioEstado: boolean = false;
  mensajeResultadoOperacion: string = '';
  criterios: CriterioGrupoMcc[] = [];
  respuestaGrupos: RespuestaGrupoMcc = getDefaultRespuestaGrupoMcc();
  grupos: GrupoMccList[] = [];
  grupoSeleccionado: GrupoMccList = getDefaultGrupoMccList();

  // PAGINACION
  defaultRegistrosPorPagina = 10;
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: this.defaultRegistrosPorPagina,
    elementCount: 0,
  };
  objGetGrupos: ParamsGetGruposMcc = {
    page: this.paginationConfig.currentPage,
    size: this.paginationConfig.pageSize,
    busqueda_avanzada: '',
    sort: '',
    order: '',
  };

  async traerGrupos() {
    this.loadingTablaGrupos = true;

    try {
      this.respuestaGrupos = await this.gestionGrupos.getGruposMcc(
        this.objGetGrupos
      );
      this.grupos = this.respuestaGrupos.grupoMccList;
      this.paginationConfig = {
        ...this.paginationConfig,
        elementCount: this.respuestaGrupos.totalItems,
      };

      //gigaparche
      if (
        this.respuestaGrupos.totalItems == 0 &&
        this.respuestaGrupos.message?.toLowerCase().includes('exito')
      ) {
        this.respuestaGrupos.message = 'No se encontraron datos.';
      }
    } catch (error) {
      console.error('Error:', error);
    }

    this.loadingTablaGrupos = false;
  }

  resetPage() {
    this.paginationConfig = { ...this.paginationConfig, currentPage: 1 };
  }

  actualizarGrupos() {
    this.objGetGrupos.page = this.paginationConfig.currentPage;
    this.traerGrupos();
  }

  onPageChange(newPage: number) {
    this.paginationConfig.currentPage = newPage;
    this.actualizarGrupos();
  }

  onSearch(searchValue: string) {
    this.resetPage();
    this.objGetGrupos.busqueda_avanzada = searchValue;
    this.actualizarGrupos();
  }

  handleSort(event: SortChangedEvent) {
    const { id: columnId, sortDirection: order } = event;
    let sortParam = '';
    let orderParam = '';
    if (order) {
      sortParam = columnId;
      orderParam = order;
    }
    this.objGetGrupos.sort = sortParam;
    this.objGetGrupos.order = orderParam;

    this.resetPage();
    this.traerGrupos();

    // Reset all SortIconDirectives except the one with matching id
    this.sortableDirectives.forEach((directive) => {
      if (directive.id !== columnId) {
        directive.reset();
      }
    });
  }

  seleccionarGrupo(grupo: GrupoMccList) {
    this.grupoSeleccionado = { ...grupo };
  }

  limpiarGrupoSeleccionado() {
    let grupo: GrupoMccList = getDefaultGrupoMccList();
    this.seleccionarGrupo(grupo);
  }

  limpiarCriterios() {
    this.criterios = [];
  }

  clickCerrarModal() {
    this.limpiarGrupoSeleccionado();
    this.limpiarCriterios();
    this.changeModalGestionarCaso();
  }

  changeModalGestionarCaso() {
    this.mostrarModalGestionarCaso = !this.mostrarModalGestionarCaso;
    let estadoDidChange = this.cambioEstado;
    this.cambioEstado = false;
    this.mensajeResultadoOperacion = '';
    if (estadoDidChange) {
      this.actualizarGrupos();
    }
  }

  clickEditarGrupo(grupo: GrupoMccList) {
    this.seleccionarGrupo(grupo);
    this.changeModalGestionarCaso();
    this.traerCriteriosGrupoSeleccionado();
  }

  async traerCriteriosGrupoSeleccionado() {
    this.cambioEstado = true;
    let params: ParamsGetCriteriosGrupo = {
      grupo_mcc_id: this.grupoSeleccionado.grupoMcc.codigoMcc,
    };
    let resp = await this.gestionGrupos.getCriteriosGrupo(params);
    this.criterios = [];
    if (resp.status === 'OK') {
      this.criterios = resp.criterios;
    }
    this.cambioEstado = false;
  }

  // TODO: manejar mensajes de error?
  async actualizarCriteriosGrupo() {
    this.cambioEstado = true;
    let criteriosNoVacios: CriterioGrupoMcc[] = this.criterios.filter(
      (c) => c.descripcion
    );
    let descs: string[] = [];
    let oblgs: boolean[] = [];
    criteriosNoVacios.forEach((val) => {
      descs.push(val.descripcion);
      oblgs.push(val.obligatorio);
    });
    let params: ParamsPostCriteriosValidacion = {
      grupo_mcc_id: this.grupoSeleccionado.grupoMcc.codigoMcc,
      descripcion: descs,
      obligatorio: oblgs,
    };
    let resp = await this.gestionGrupos.postCriteriosValidacion(params);
    if (resp.status === 'OK') {
      this.mensajeResultadoOperacion =
        'Criterios de Validacion actualizados exitosamente.';
    } else {
      this.mensajeResultadoOperacion = resp.message;
    }
  }

  agregarCriterio() {
    // Agregar una nueva configuración vacía al arreglo
    this.criterios.push({
      descripcion: '',
      obligatorio: false,
    } as CriterioGrupoMcc);
  }

  eliminarCriterio(index: number) {
    this.criterios.splice(index, 1);
  }
}
