import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  SortChangedEvent,
  SortIconDirective,
} from 'src/app/modules/comunes/directives/sort-icon.directive';
import { PaginationConfig } from 'src/app/modules/comunes/pagination/pagination.component';
import { Comercio, getDefaultComercio } from 'src/models/comercio/Comercio';
import { ParamsGetComercios } from 'src/models/comercio/GetComercios';
import { ParamsUpdateComercios } from 'src/models/comercio/UpdateComercio';
import { ConfiguracionComercioService } from '../../../services/configuracion-comercio.service';

export interface ConfigOutput {
  id: number;
  monto: number;
}
interface ComercioCheck extends Comercio {
  selected: boolean;
}

@Component({
  selector: 'app-config-comercio',
  templateUrl: './config-comercio.component.html',
  styleUrls: ['./config-comercio.component.css'],
})
export class ConfigComercioComponent implements OnInit {
  constructor(private configComercioService: ConfiguracionComercioService) {}
  @ViewChildren(SortIconDirective)
  sortableDirectives!: QueryList<SortIconDirective>;

  montoInput = '';
  comercio_id = 0;
  mostrarModalFiltros = false;
  debitoInicialActivado = false;

  comerciosCheck: ComercioCheck[] = [];
  loadingComercios = false;
  mensajeRespuestaComercios: string = '';
  registrosPorPagina = 10;

  showToast = false;
  mensajeResultadoPutMasivo = '';
  putMasivoOk = false;
  private _comercios: Comercio[] = [];

  public get comercios(): Comercio[] {
    return this._comercios;
  }
  public set comercios(v: Comercio[]) {
    this._comercios = v;
    this.comerciosCheck = this._comercios.map((ele) => {
      return { ...ele, selected: false };
    });
  }

  resetToastVars() {
    this.showToast = false;
    this.mensajeResultadoPutMasivo = '';
    this.putMasivoOk = false;
  }

  private _mostrarModalGestionar: boolean = false;
  public get mostrarModalGestionar(): boolean {
    return this._mostrarModalGestionar;
  }
  public set mostrarModalGestionar(v: boolean) {
    this._mostrarModalGestionar = v;
    if (this.mostrarModalGestionar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  get allSelected(): boolean {
    if (!this.comerciosCheck) return false;
    return !this.comerciosCheck.find((ele) => !ele.selected);
  }

  set allSelected(v: boolean) {
    this.comerciosCheck.forEach((ele) => (ele.selected = v));
  }

  get selectedCount() {
    return this.comerciosCheck.filter((ele) => ele.selected).length;
  }

  get noneSelected() {
    return this.selectedCount === 0;
  }

  mostrarModalConfirmacion: boolean = false;
  modalParam1: string = 'GUARDAR CAMBIOS';
  get modalParam2(): string {
    return `¿Desea aplicar esta configuracion de monto minimo y debito inicial para los ${this.selectedCount} comercios seleccionados?`;
  }

  openModalEntera() {
    this.mostrarModalConfirmacion = true;
  }

  closeModalEntera() {
    this.mostrarModalConfirmacion = false;
  }

  // PAGINACION
  defaultRegistrosPorPagina = 10;
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: this.defaultRegistrosPorPagina,
    elementCount: 0,
  };
  paramsGetComercios: ParamsGetComercios = {
    page: 1,
    size: this.registrosPorPagina,
    busqueda_avanzada: '',
  };

  get totalRegistrosPagination() {
    return this.paginationConfig.elementCount;
  }

  resetPage() {
    this.paginationConfig = { ...this.paginationConfig, currentPage: 1 };
  }

  openFiltros() {
    this.mostrarModalFiltros = !this.mostrarModalFiltros;
  }

  onPageChange(newPage: number) {
    this.paginationConfig.currentPage = newPage;
    this.actualizarComercios();
  }

  onSearch(searchValue: string) {
    this.resetPage();
    this.paramsGetComercios.busqueda_avanzada = searchValue;
    this.actualizarComercios();
  }

  actualizarComercios() {
    this.paramsGetComercios.page = this.paginationConfig.currentPage;
    this.traerComercios();
  }

  get isInputInvalid() {
    return false;
  }

  get botonAplicarDeshabilitado() {
    return this.noneSelected || !this.montoInput || this.isInputInvalid;
  }

  formatearMonto(monto: number) {
    return monto.toLocaleString('es-ES'); // Utiliza la configuración regional para separar los miles
  }

  async traerComercios() {
    this.loadingComercios = true;
    let response = await this.configComercioService.getComercios(
      this.paramsGetComercios
    );
    this.comercios = response.comercios;
    this.paginationConfig = {
      ...this.paginationConfig,
      elementCount: response.totalElements,
    };
    this.mensajeRespuestaComercios =
      response.message || 'No se encontraron datos.';
    this.loadingComercios = false;
  }

  comercioSeleccionado: Comercio = getDefaultComercio();

  getParamsUpdateComercios(): ParamsUpdateComercios {
    let selected = this.comerciosCheck.filter((ele) => ele.selected);
    let n = selected.length;
    let ids: number[] = selected.map((ele) => ele.id);
    let montos: number[] = Array.from<number>({ length: n }).fill(
      parseInt(this.montoInput)
    );
    let boolsDeb: boolean[] = Array.from<boolean>({ length: n }).fill(
      this.debitoInicialActivado
    );
    return {
      comercio_ids: ids,
      montos_minimos: montos,
      debitos_iniciales: boolsDeb,
    };
  }

  async actualizarConfigsComercio() {
    this.loadingComercios = true;

    let params = this.getParamsUpdateComercios();
    
    let response = await this.configComercioService.updateComercios(params);
    
    this.mensajeResultadoPutMasivo = response.message;
    this.putMasivoOk = response.status === 'OK';
    this.showToast = true;
    this.loadingComercios = false;
  }

  async aplicarConfiguraciones() {
    this.closeModalEntera();
    await this.actualizarConfigsComercio();
    this.montoInput = '';
    this.debitoInicialActivado = false;
    this.comercios = [];
    this.traerComercios();
  }

  openModalGestionarSubcomercio(subcomercio: Comercio) {
    this.comercioSeleccionado = subcomercio;
    this.mostrarModalGestionar = true;
  }

  onModalClose() {
    this.mostrarModalGestionar = false;
    this.montoInput = '';
    this.comercios = [];
    this.traerComercios();
  }

  ngOnInit(): void {
    this.traerComercios();
  }

  handleSort(event: SortChangedEvent) {
    const { id: columnId, sortDirection: order } = event;
    let sortParam = '';
    let orderParam = '';
    if (order) {
      sortParam = columnId;
      orderParam = order;
    }
    this.paramsGetComercios.sort = sortParam;
    this.paramsGetComercios.order = orderParam;

    this.resetPage();
    this.traerComercios();

    // Reset all SortIconDirectives except the one with matching id
    this.sortableDirectives.forEach((directive) => {
      if (directive.id !== columnId) {
        directive.reset();
      }
    });
  }
}
