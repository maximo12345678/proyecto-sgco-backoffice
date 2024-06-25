import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EstadosSGCO, UserRoles } from 'src/app/constants';
import {
  SortChangedEvent,
  SortIconDirective,
} from 'src/app/modules/comunes/directives/sort-icon.directive';
import { ESTADO_APROBADO_ID } from 'src/app/modules/comunes/filtros/filtros-motivo/filter-data';
import { PaginationConfig } from 'src/app/modules/comunes/pagination/pagination.component';
import { VariablesGlobalesService } from 'src/app/modules/comunes/variables-globales.service';
import {
  formatearFecha as formatearFechaFn,
  formatearMonto as formatearMontoFn,
} from 'src/app/utils';
import { Contracargo } from 'src/models/contracargos/Contracargo';
import { MotivoFilterSelection } from 'src/models/filtros/Filtro';
import {
  FORMULARIO_NUM_KEYS,
  getDefaultFormularioMotivo,
} from 'src/models/motivos/FormularioMotivo';
import {
  ParamsGetMotivos,
  RespuestaGetMotivos,
  getDefaultRespuestaGetMotivos,
} from 'src/models/motivos/GetMotivos';
import { Motivo, getDefaultMotivo } from 'src/models/motivos/Motivo';
import { ParametroPutMotivoAdmin } from 'src/models/motivos/PutMotivo';
import { MotivosService } from '../../services/motivos.service';

@Component({
  selector: 'app-motivos-admin',
  templateUrl: './motivos-admin.component.html',
  styleUrls: ['./motivos-admin.component.css'],
})
export class MotivosAdminComponent implements OnInit {
  constructor(
    private motivosService: MotivosService,
    private variablesGlobales: VariablesGlobalesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChildren(SortIconDirective)
  sortableDirectives!: QueryList<SortIconDirective>;

  readonly M_MOTIVO_POR_APROBAR =
    EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_POR_APROBAR;
  readonly V_MOTIVO_POR_APROBAR =
    EstadosSGCO.CONTRACARGO_VISA_MOTIVO_POR_APROBAR;

  readonly M_MOTIVO_APROBADO =
    EstadosSGCO.CONTRACARGO_MASTERCARD_MOTIVO_APROBADO;
  readonly V_MOTIVO_APROBADO = EstadosSGCO.CONTRACARGO_VISA_MOTIVO_APROBADO;

  readonly MENSAJE_APROBACION_EXITOSA = 'SE HA APROBADO MOTIVO CON ÉXITO';
  readonly MENSAJE_ACTUALIZACION_EXITOSA = 'SE HA ACTUALIZADO MOTIVO CON ÉXITO';

  readonly MARCA_ESTADO_POR_APROBAR_MAP: { [key: number]: number } = {
    1: this.M_MOTIVO_POR_APROBAR,
    2: this.V_MOTIVO_POR_APROBAR,
  };

  isAlertasNavigation = false;

  // principio de menor permiso. en OnInit verificamos si es admin
  rolUsuario = UserRoles.Ejecutivo;
  idUsuario = 0;
  objResMotivos: RespuestaGetMotivos = getDefaultRespuestaGetMotivos();
  cambioEstado: boolean = false;
  mensajeResultadoOperacion: string = '';
  operacionExitosa: boolean = false;

  initialSelection: MotivoFilterSelection = { marcas: [], estados: [] };

  // Modal para gestionar el caso.
  mostrarModalGestionarMotivo: boolean = false;
  loadingMotivos: boolean = false;

  contracargos: Contracargo[] = [];
  motivos: Motivo[] = [];
  motivoSeleccionado: Motivo = getDefaultMotivo();

  // PAGINACION
  defaultRegistrosPorPagina = 10;
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: this.defaultRegistrosPorPagina,
    elementCount: 0,
  };

  objGetMotivos: ParamsGetMotivos = {
    aprobado: undefined,
    marca_id: undefined,
    page: this.paginationConfig.currentPage,
    size: this.paginationConfig.pageSize,
    busqueda_avanzada: '',
  };

  get totalRegistrosPagination() {
    return this.paginationConfig.elementCount;
  }

  resetPage() {
    this.paginationConfig = { ...this.paginationConfig, currentPage: 1 };
  }

  onPageChange(newPage: number) {
    this.paginationConfig.currentPage = newPage;
    this.actualizarMotivos();
  }

  onSearch(searchValue: string) {
    this.resetPage();
    this.objGetMotivos.busqueda_avanzada = searchValue;
    this.actualizarMotivos();
  }

  handleSort(event: SortChangedEvent) {
    const { id: columnId, sortDirection: order } = event;
    let sortParam = '';
    let orderParam = '';
    if (order) {
      sortParam = columnId;
      orderParam = order;
    }
    this.objGetMotivos.sort = sortParam;
    this.objGetMotivos.order = orderParam;

    this.resetPage();
    this.traerMotivos();

    // Reset all SortIconDirectives except the one with matching id
    this.sortableDirectives.forEach((directive) => {
      if (directive.id !== columnId) {
        directive.reset();
      }
    });
  }

  // formulario inputs motivos
  formData = getDefaultFormularioMotivo();

  comercioOptions: { name: string }[] = [];

  actualizarMotivos() {
    this.objGetMotivos.page = this.paginationConfig.currentPage;
    this.traerMotivos();
  }

  async traerMotivos() {
    this.loadingMotivos = true;
    try {
      this.objResMotivos = await this.motivosService.getMotivos(
        this.objGetMotivos
      );
      this.motivos = this.objResMotivos.data;
      this.paginationConfig = {
        ...this.paginationConfig,
        elementCount: this.objResMotivos.total_elements,
      };
    } catch (error) {
      console.error('Error:', error);
    }
    this.loadingMotivos = false;
  }

  clickGestionarMotivo(motivo: Motivo) {
    this.motivoSeleccionado = motivo;
    this.changeModalGestionarMotivo();
  }

  motivoAprobado(motivo: Motivo) {
    return Boolean(motivo.fecha_aprobacion);
  }

  changeModalGestionarMotivo() {
    this.mostrarModalGestionarMotivo = !this.mostrarModalGestionarMotivo;
    let estadoDidChange = this.cambioEstado;
    this.cambioEstado = false;
    this.mensajeResultadoOperacion = '';
    this.operacionExitosa = false;
    if (this.mostrarModalGestionarMotivo) {
      document.body.style.overflow = 'hidden';
      this.fillFormData();
    } else {
      document.body.style.overflow = '';
      this.clearFormData();
    }

    if (estadoDidChange) {
      this.actualizarMotivos();
    }
  }

  formatearFecha: (fechaParam: string) => string = formatearFechaFn;
  formatearMonto: (monto: number) => string = formatearMontoFn;

  submitForm() {
    let motivoAprobado = !!this.motivoSeleccionado.fecha_aprobacion;
    if (motivoAprobado) {
      this.actualizarMotivoSeleccionado();
    } else {
      this.aprobarMotivo();
    }
  }

  clearFormData() {
    this.formData = getDefaultFormularioMotivo();
  }

  fillFormData() {
    this.formData = {
      descripcion: this.motivoSeleccionado.descripcion,
      dias_transaccion: this.motivoSeleccionado.dias_transaccion_no_mayor_a,
      gestiona_analista: this.motivoSeleccionado.gestiona_analista,
      presentacion_tardia: this.motivoSeleccionado.presentacion_tardia,
    };
  }

  getParametroPutMotivo() {
    let putMotivoBody: ParametroPutMotivoAdmin = {
      motivo_id: this.motivoSeleccionado.id_motivo,
      marca_id: this.motivoSeleccionado.id_marca,
      codigo_motivo: this.motivoSeleccionado.codigo_motivo,
      descripcion: this.formData.descripcion!,
      dias_transaccion: this.formData.dias_transaccion!,
      gestiona_analista: this.formData.gestiona_analista!,
      presentacion_tardia: this.formData.presentacion_tardia!,
      usuario_aprobador_id: this.idUsuario,
    };
    return putMotivoBody;
  }

  async actualizarMotivoSeleccionado() {
    this.cambioEstado = true;
    let putMotivoBody = this.getParametroPutMotivo();
    let respPutMotivo = await this.motivosService.updateMotivo(putMotivoBody);
    if (respPutMotivo.status !== 'OK') {
      this.mensajeResultadoOperacion = respPutMotivo.message;
      return;
    }
    this.operacionExitosa = true;
    this.mensajeResultadoOperacion = this.MENSAJE_ACTUALIZACION_EXITOSA;
  }

  async aprobarMotivo() {
    this.cambioEstado = true;
    this.operacionExitosa = false;

    let putMotivoBody = this.getParametroPutMotivo();
    let respPutMotivo = await this.motivosService.updateMotivo(putMotivoBody);
    if (respPutMotivo.status !== 'OK') {
      this.mensajeResultadoOperacion = respPutMotivo.message;
      return;
    }
    this.motivoSeleccionado.estado = 'Aprobado';
    this.operacionExitosa = true;
    this.mensajeResultadoOperacion = this.MENSAJE_APROBACION_EXITOSA;
  }

  get canSubmitForm(): boolean {
    return (
      Object.keys(this.formData).length == FORMULARIO_NUM_KEYS &&
      Object.values(this.formData).every((o) => o !== null && o !== '')
    );
  }

  get descriptionInvalid(): boolean {
    return (
      !this.motivoSeleccionado.descripcion ||
      this.motivoSeleccionado.descripcion.length < 4
    );
  }

  get presTardInvalid(): boolean {
    return this.motivoSeleccionado.presentacion_tardia === null;
  }

  get gestAnalistInvalid(): boolean {
    return this.motivoSeleccionado.gestiona_analista === null;
  }

  renderEstado(mot: Motivo) {
    return mot.fecha_aprobacion ? 'Aprobado' : 'Por Aprobar';
  }

  canEditEntry(
    fecha_aprobacion = this.motivoSeleccionado.fecha_aprobacion
  ): boolean {
    if (this.rolUsuario !== UserRoles.Admin) {
      return false;
    }
    if (fecha_aprobacion) {
      return false;
    }
    return true;
  }
  actualizarFiltrosMarcaEstado(idsSeleccionados: MotivoFilterSelection) {
    this.objGetMotivos.marca_id = undefined;
    this.objGetMotivos.aprobado = undefined;
    if (idsSeleccionados.marcas.length === 1) {
      this.objGetMotivos.marca_id = idsSeleccionados.marcas[0];
    }
    if (idsSeleccionados.estados.length === 1) {
      this.objGetMotivos.aprobado =
        idsSeleccionados.estados[0] === ESTADO_APROBADO_ID;
    }
    this.resetPage();
    this.actualizarMotivos(); //llamamos funcion para que se actualicen los datos de la tabla
  }

  // Boton de filtro FECHA seleccionado
  botonFechaSeleccionado: number = 2;
  seleccionarBotonFiltro(numero: number): void {
    this.botonFechaSeleccionado = numero;
  }

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

    let { status, usuario } = this.variablesGlobales.getUsuarioStorage();
    if (status && usuario.rol_id) {
      this.rolUsuario = usuario.rol_id;
      this.idUsuario = usuario.usuario_id;
    }
    if (!this.isAlertasNavigation) {
      this.traerMotivos();
    }
  }
}
