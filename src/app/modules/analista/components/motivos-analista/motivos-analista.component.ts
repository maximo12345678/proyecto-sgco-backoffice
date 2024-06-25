import { Component, OnInit, QueryList } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EstadosSGCO, Marcas, UserRoles } from 'src/app/constants';
import {
  SortChangedEvent,
  SortIconDirective,
} from 'src/app/modules/comunes/directives/sort-icon.directive';
import { PaginationConfig } from 'src/app/modules/comunes/pagination/pagination.component';
import {
  formatearFecha as formatearFechaFn,
  formatearMonto as formatearMontoFn,
} from 'src/app/utils';
import { ResponseStatus } from 'src/models/ApiCommons';
import {
  Contracargo,
  getDefaultContracargo,
} from 'src/models/contracargos/Contracargo';
import {
  ParamsGetContracargo,
  RespuestaContracargos,
} from 'src/models/contracargos/GetContracargo';
import { FilterSelection, FiltroCbkConfig } from 'src/models/filtros/Filtro';
import {
  FORMULARIO_NUM_KEYS,
  getDefaultFormularioMotivo,
} from 'src/models/motivos/FormularioMotivo';
import { ParamsPutMotivo } from 'src/models/motivos/PutMotivo';
import { ContracargosService } from '../../services/contracargos.service';
import { MotivosService } from '../../services/motivos.service';
import { ESTADOS, ETAPAS, MARCAS, etapaMap, marcaMap } from './filter-data';

@Component({
  selector: 'app-motivos-analista',
  templateUrl: './motivos-analista.component.html',
  styleUrls: ['./motivos-analista.component.css'],
})
export class MotivosAnalistaComponent implements OnInit {
  constructor(
    private contracargosService: ContracargosService,
    private motivoUpdateService: MotivosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  sortableDirectives!: QueryList<SortIconDirective>;
  readonly ESTADOS_RELEVANTES = [
    EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_NO_ENCONTRADO,
    EstadosSGCO.CONTRACARGO_VISA_MOTIVO_NO_ENCONTRADO,
    EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_POR_APROBAR,
    EstadosSGCO.CONTRACARGO_VISA_MOTIVO_POR_APROBAR,
  ];

  readonly MENSAJE_OPERACION_EXITOSA =
    'SE HA REGISTRADO MOTIVO Y ENVIADO A APROBACIÓN.';

  readonly MARCAS_MAP: { [key: string]: number } = {
    MASTERCARD: Marcas.Mastercard,
    VISA: Marcas.Visa,
  };

  isAlertasNavigation = false;
  rolUsuario = UserRoles.Analista;
  idUsuario = 0;

  objResContracargos: RespuestaContracargos = {
    contracargos: [],
    curPage: 0,
    message: '',
    pageSize: 0,
    total: 0,
    status: ResponseStatus.ok,
  };

  cambioEstado: boolean = false;
  mensajeResultadoOperacion: string = '';
  operacionExitosa: boolean = false;

  // Modal para gestionar el caso.
  mostrarModalGestionarMotivo: boolean = false;
  loadingTablaContracargos: boolean = false;

  tokenLogin: any;
  contracargos: Contracargo[] = [];
  contracargoSeleccionado: Contracargo = getDefaultContracargo();

  // PAGINACION
  defaultRegistrosPorPagina = 10;
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: this.defaultRegistrosPorPagina,
    elementCount: 0,
  };

  objGetContracargo: ParamsGetContracargo = {
    marcas: [],
    estados: this.ESTADOS_RELEVANTES,
    etapas: [],
    fecha_desde: '',
    fecha_hasta: '',
    page: this.paginationConfig.currentPage,
    ultimos_dias: undefined,
    busqueda_avanzada: '',
  };

  initialSelection: FilterSelection = {
    marcas: [],
    estados: [],
    etapas: [],
  };

  filtrosConfig: FiltroCbkConfig = {
    marcas: MARCAS,
    etapas: ETAPAS,
    estados: ESTADOS,
    marcaMap: marcaMap,
    etapaMap: etapaMap,
  };

  get totalRegistrosPagination() {
    return this.paginationConfig.elementCount;
  }

  resetPage() {
    this.objGetContracargo.page = 1;
    this.paginationConfig = { ...this.paginationConfig, currentPage: 1 };
  }

  onPageChange(newPage: number) {
    this.paginationConfig.currentPage = newPage;
    this.objGetContracargo.page = newPage;
    this.traerContracargos();
  }

  onSearch(searchValue: string) {
    let finalVal = searchValue;
    // pequenio hack para que la busqueda funcione incluso si
    // se copia y pega el caso que aparece en la tabla
    // [V|M]2390798519 -> 2390798519
    if (
      searchValue.length > 1 &&
      ['m', 'v'].includes(searchValue.toLowerCase().charAt(0)) &&
      parseInt(searchValue.substring(1))
    ) {
      finalVal = searchValue.substring(1);
    }

    this.objGetContracargo.busqueda_avanzada = finalVal;
    this.resetPage();
    this.traerContracargos();
  }

  handleSort(event: SortChangedEvent) {
    const { id: columnId, sortDirection: order } = event;
    let sortParam = '';
    let orderParam = '';
    if (order) {
      sortParam = columnId;
      orderParam = order;
    }
    this.objGetContracargo.sort = sortParam;
    this.objGetContracargo.order = orderParam;

    this.resetPage();
    this.traerContracargos();

    // Reset all SortIconDirectives except the one with matching id
    this.sortableDirectives.forEach((directive) => {
      if (directive.id !== columnId) {
        directive.reset();
      }
    });
  }

  actualizarFiltrosMarcaEstado(idsSeleccionados: FilterSelection) {
    this.objGetContracargo.marcas = idsSeleccionados.marcas;
    this.objGetContracargo.etapas = [];
    if (!idsSeleccionados.estados || idsSeleccionados.estados.length === 0) {
      this.objGetContracargo.estados = this.ESTADOS_RELEVANTES;
    } else {
      this.objGetContracargo.estados = idsSeleccionados.estados;
    }
    this.resetPage();
    this.traerContracargos();
  }

  // formulario inputs motivos
  formData = getDefaultFormularioMotivo();

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      const paramsVal = params['estados'];
      if (paramsVal) {
        this.initialSelection = {
          ...this.initialSelection,
          estados: paramsVal.map((ele: string) => parseInt(ele)),
        };
        this.isAlertasNavigation = true;
        this.actualizarFiltrosMarcaEstado(this.initialSelection);

        const navigationExtras: NavigationExtras = {
          queryParams: {},
        };
        this.router.navigate([], navigationExtras);
      }
    });

    if (!this.isAlertasNavigation) {
      this.traerContracargos();
    }
  }

  async traerContracargos() {
    this.loadingTablaContracargos = true;
    try {
      this.objResContracargos = await this.contracargosService.getContracargos(
        this.objGetContracargo
      );
      this.contracargos = this.objResContracargos.contracargos;
      this.paginationConfig = {
        ...this.paginationConfig,
        elementCount: this.objResContracargos.total,
      };
    } catch (error) {
      console.error('Error:', error);
    }
    this.loadingTablaContracargos = false;
  }

  clickGestionarMotivo(cc: Contracargo) {
    this.contracargoSeleccionado = cc;
    if (cc.motivoDesc && cc.motivoDesc.length > 0) {
      this.formData.descripcion = cc.motivoDesc;
    }
    this.changeModalGestionarMotivo();
  }

  changeModalGestionarMotivo() {
    this.mostrarModalGestionarMotivo = !this.mostrarModalGestionarMotivo;
    let estadoDidChange = this.cambioEstado;
    this.cambioEstado = false;
    this.mensajeResultadoOperacion = '';
    this.operacionExitosa = false;
    this.clearFormData();
    if (estadoDidChange) {
      this.resetPage();
      this.traerContracargos();
    }
  }

  formatearFecha: (fechaParam: string) => string = formatearFechaFn;
  formatearMonto: (monto: number) => string = formatearMontoFn;

  getLetraInicialMarca(cc: Contracargo): string {
    if (!cc?.marca) {
      return '';
    }
    return cc.marca[0].toUpperCase();
  }

  submitForm() {
    this.actualizarMotivo();
  }

  clearFormData() {
    this.formData = getDefaultFormularioMotivo();
  }

  async actualizarMotivo() {
    this.cambioEstado = true;
    this.operacionExitosa = false;
    let putMotivoBody: ParamsPutMotivo = {
      motivo_id: parseInt(this.contracargoSeleccionado.motivoId),
      marca_id: this.MARCAS_MAP[this.contracargoSeleccionado.marca],
      codigo_motivo: this.contracargoSeleccionado.motivoCodigo,
      descripcion: this.formData.descripcion!,
      dias_transaccion: this.formData.dias_transaccion!,
      gestiona_analista: this.formData.gestiona_analista!,
      presentacion_tardia: this.formData.presentacion_tardia!,
    };
    let respMotivo = await this.motivoUpdateService.putMotivo(putMotivoBody);
    if (respMotivo.status !== 'OK') {
      this.mensajeResultadoOperacion = respMotivo.message;
      return;
    }

    this.operacionExitosa = true;
    this.mensajeResultadoOperacion = this.MENSAJE_OPERACION_EXITOSA;
    this.contracargoSeleccionado.estado = 'Motivo Por Aprobar';
  }

  get canSubmitForm(): boolean {
    return (
      Object.keys(this.formData).length == FORMULARIO_NUM_KEYS &&
      Object.values(this.formData).every((o) => o !== null && o !== '')
    );
  }

  canEditEntry(
    estadoContracargo: number = this.contracargoSeleccionado.estadoId
  ): boolean {
    if (this.rolUsuario === UserRoles.Ejecutivo.valueOf()) {
      return false;
    }
    return (
      estadoContracargo === EstadosSGCO.CONTRACARGO_VISA_MOTIVO_NO_ENCONTRADO ||
      estadoContracargo ===
        EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_NO_ENCONTRADO
    );
  }

  // Boton de filtro FECHA seleccionado
  botonFechaSeleccionado: number = 2;
  seleccionarBotonFiltro(numero: number): void {
    this.botonFechaSeleccionado = numero;
  }
}
