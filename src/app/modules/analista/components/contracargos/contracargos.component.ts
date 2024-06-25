//librerias
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';


//servicios
import { ContracargosService } from '../../services/contracargos.service';
import { FiltrosService } from '../../services/filtros.service';
import { IndicadoresService } from '../../services/indicadores.service';

//modelos
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EstadosPorAbonar, EstadosPorCerrar, EstadosPorDebitar, EstadosPorGestionar, EstadosPorRepresentar, EstadosSGCO, Marcas, UserRoles } from 'src/app/constants';
import { SortChangedEvent, SortIconDirective } from 'src/app/modules/comunes/directives/sort-icon.directive';
import { PaginationConfig } from 'src/app/modules/comunes/pagination/pagination.component';
import { DescargaCsvService } from 'src/app/modules/comunes/services/descarga-csv.service';
import { VariablesGlobalesService } from 'src/app/modules/comunes/variables-globales.service';
import { ResponseStatus } from 'src/models/ApiCommons';
import { OptionListaDesplegable } from 'src/models/OptionListaDesplegable';
import { ParamsCambioEstado } from 'src/models/contracargos/CambioEstado';
import { Contracargo, getDefaultContracargo } from 'src/models/contracargos/Contracargo';
import { ParamsGetContracargo, RespuestaContracargos } from 'src/models/contracargos/GetContracargo';
import { CriterioValidacion } from 'src/models/criterios-validacion/CriterioValidacion';
import { DocumentoGetEvidencia, ParametroGetEvidencia } from 'src/models/evidencia/GetEvidencia';
import { ParametroPostEvidencia } from 'src/models/evidencia/PostEvidencia';
import { FilterSelection, FiltroCbkConfig } from 'src/models/filtros/Filtro';
import { ParamsGetIndicadores, RespuestaIndicadores } from 'src/models/indicadores/GetIndicadores';
import { Indicador } from 'src/models/indicadores/Indicador';
import { PostOpcionEtapaParams } from 'src/models/opcion-etapa/PostOpcionEtapa';
import { AmpliarPlazoGestionService } from '../../services/ampliar-plazo-gestion.service';
import { CambioEstadoService } from '../../services/cambio-estado.service';
import { CriteriosValidacionService } from '../../services/criterios-validacion.service';
import { EnviarJsonFormularioService } from '../../services/enviar-json.service';
import { EvidenciasService } from '../../services/evidencias.service';
import { HistorialCasoService } from '../../services/historial-caso.service';
import { JsonFormularioService } from '../../services/json-formulario.service';
import { RechazarEvidenciaService } from '../../services/rechazar-evidencia.service';
import { ESTADOS, ETAPAS, MARCAS, etapaMap, marcaMap } from './filter-data';

import { formatearFecha as formatearFechaFn, formatearMonto as formatearMontoFn } from 'src/app/utils';
import { HistorialContracargo } from 'src/models/contracargos/HistorialContracargo';

interface CriterioValidacionForm extends CriterioValidacion {
  validado: boolean
}

@Component({
  selector: 'app-contracargos',
  templateUrl: './contracargos.component.html',
  styleUrls: ['./contracargos.component.css'],
})
export class ContracargosComponent implements OnInit {
  constructor(
    //Inyectamos los servicios en el constructor.
    private contracargosService: ContracargosService,
    private indicadoresService: IndicadoresService,
    private filtrosService: FiltrosService,
    private cambioEstadoService: CambioEstadoService,
    private jsonFormularioService: JsonFormularioService,
    private enviarJsonFormularioService: EnviarJsonFormularioService,
    private traerHistorialDelCasoService: HistorialCasoService,
    private evidenciasService: EvidenciasService,
    private rechazarEvidenciaService: RechazarEvidenciaService,

    private dataStorageService: VariablesGlobalesService,
    private criteriosValidacionService: CriteriosValidacionService,
    private ampliarPlazoGestionService: AmpliarPlazoGestionService,
    private route: ActivatedRoute,
    private router: Router,
    private descargaCsvService: DescargaCsvService,

  ) { }

  @ViewChildren(SortIconDirective)
  sortableDirectives!: QueryList<SortIconDirective>;
  // Para aceptar prearbitraje mastercard se crearon estos nuevos estados.
  readonly ACEPTAR_PRE_ARBITRAJE_MASTERCARD_PREVIO = 159; // el estado es 'Previo por Aceptar' en etapa disputa. lo tomamos aca y cuando se guarde solo el formulario de solo un texto, ahi lo dejamos en Por Aceptar.
  readonly ACEPTAR_PRE_ARBITRAJE_MASTERCARD_NUEVO_ESTADO = 160; // el estado queda en 'Por Aceptar' en etapa disputa, luego este lo toma el bot y lo cambia a 'Aceptado'

  readonly OBJ_REPRESENTACION_BODY = {
    value: false,
    nombreBotonIniciar: '',
    nombreBotonGuardar: '',
    cabeceraConfig: '',
    validarEvidencia: false,
    soloFormulario: false,
    msjValidarEvidencia: '',
    tituloFormulario: '',
    etapaIdJson: 0,
    opcionPortalId: 0,
    codMotivoJson: null,
    mensajeExito: '',
    statusFinal: 0,
    nuevoEstado: '',
    nuevoEstadoId: 0,
    cantEstadosNuevos: [],
    etapas: {
      etapasDisponibles: 0,
      etapaValidarEvidencia: { valor: false, pos: 0 },
      etapaFormulario: { valor: false, pos: 0 },
      etapaCargaEvidencia: { valor: false, pos: 0 },
      edicionCaso: false,
    },
  };


  readonly MAX_NUM_FILES_EVIDENCE = 5;

  estadosContracargoPorGestionar: number[] = [
    EstadosSGCO.CONTRACARGO_MASTERCARD_POR_GESTIONAR,
    EstadosSGCO.CONTRACARGO_VISA_POR_GESTIONAR,
  ];
  cambioEstado: boolean = false; //
  mensajeSatisfactorio: string = '';
  botonEstadoSeleccionado: number = 1; // Boton de filtro ESTADO seleccionado
  botonFechaSeleccionado: number = 0; // Boton de filtro FECHA seleccionado

  private _mostrarModalGestionarCaso: boolean = false;
  public get mostrarModalGestionarCaso(): boolean {
    return this._mostrarModalGestionarCaso;
  }
  public set mostrarModalGestionarCaso(v: boolean) {
    this._mostrarModalGestionarCaso = v;
    if (this.mostrarModalGestionarCaso) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  mostrarModalDocYForm: boolean = false; // Modal para visualizar documento y completar formulario
  etapaFormulario: number = 1; // Manejo de Etapas de formulario
  optionRadio: string = ''; //input radio
  indicadores: Indicador[] = []; // objeto de indicadores  ¡¡¡¡¡¡¡¡¡ PONER COMO OBJETO OTRA VEZ !!!!!!!!!!!!!!!!!!!!!!
  objResIndicadores: RespuestaIndicadores = {
    indicadores: [],
    message: '',
    status: ResponseStatus.ok,
  };
  objGetIndicadores: ParamsGetIndicadores = {
    comercio_id: [0],
  };
  objResContracargos: RespuestaContracargos = {
    // Objeto con datos de la respuesta de la api de contracargos.
    contracargos: [],
    curPage: 0,
    message: '',
    pageSize: 0,
    total: 0,
    status: ResponseStatus.unknown,
  };

  isAlertasNavigation = false;

  filtrosConfig: FiltroCbkConfig = {
    marcas: MARCAS,
    etapas: ETAPAS,
    estados: ESTADOS,
    marcaMap: marcaMap,
    etapaMap: etapaMap
  }

  initialSelection: FilterSelection = {
    // marcas: [1, 2],
    marcas: [],
    estados: [],
    etapas: [],
  };

  // PAGINACION
  defaultRegistrosPorPagina = 10;
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: this.defaultRegistrosPorPagina,
    elementCount: 0,
  };

  objGetContracargo: ParamsGetContracargo = {
    // Objeto que le enviamos como parametro en la llamada a la api de contracargos.
    fecha_desde: '2023-08-01',
    fecha_hasta: '2023-11-30',
    page: this.paginationConfig.currentPage,
    ultimos_dias: undefined,
    busqueda_avanzada: '',
    sort: '',
    order: '',
    ...this.initialSelection,
  };
  contracargos: Contracargo[] = []; // Lista de todos los contracargos

  casoSeleccionado: Contracargo = getDefaultContracargo();
  opcionesFiltradas: any[] = []; // Guardamos las opciones del filtro elegido, para ser iterado en la vista.

  objCambioEstado: ParamsCambioEstado = {
    // Objeto para enviar como parametro a la api de cambio de estado.
    contracargo_id: 0, //id del caso seleccionado
    estado_final: 0,
  };

  objTraerJsonFormulario: any = {
    // Con esto le indicamos a la api que trae el json que etapa es.
    etapa_id: 0,
    motivo_id: null,
  };
  objResTraerJsonFormulario: any = {
    codigo_motivo: 0,
    data: '',
    etapa_id: 0,
    message: '',
    opcion_portal_id: 0,
  };

  objSubirJsonFormulario: PostOpcionEtapaParams = {
    // Objeto para enviarle a la api el JSON con el formulario completo
    contracargo_id: 0,
    etapa_id: 0,
    opcion_portal_id: 0,
    opciones_json: '',
    id_interno_marca: 0,
    marca_id: 0,
    motivo_id: 0
  };
  jsonFormulario: any = ''; // Guarda el JSON que se trae de la api.

  objGetHistorialCaso: any = {
    // Objeto con
    contracargo_id: 0,
  };
  historialCaso: HistorialContracargo[] = [];
  loadingTablaHistorial: boolean = false; // bandera para activar spinner loading de tabla historial
  loadingFormulario: boolean = false; // bandera para activar spinner loading de formulario representacion
  loadingTablaContracargos: boolean = false; // bandera para activar spinner loading de tabla contracargos
  loadingCambioEstado: boolean = false;
  loadingDescarga: boolean = false;
  listaComercios: any;

  mostrarModalConfirmarDescarga: boolean = false;
  titleModalConfirmarDescarga: string = '¿Descargar datos?';
  subtitleModalConfirmarDescarga: string = 'Se descargará el contenido actualmente visible de la tabla de contracargos.';


  marcasId: number[] = [Marcas.Mastercard, Marcas.Visa];
  estadosGestionar: number[] = EstadosPorGestionar;
  estadosDebitar: number[] = EstadosPorDebitar;
  estadosAbonar: number[] = EstadosPorAbonar;
  estadosCerrar: number[] = EstadosPorCerrar;
  estadosRepresentar: number[] = EstadosPorRepresentar;

  motivosFormVisa2: string[] = ['12.6', '12.6.1', '12.6.2', '13.1', '13.2', '13.3', '13.6', '13.7'];
  representacionBody: any = { ...this.OBJ_REPRESENTACION_BODY }
  representado: boolean = false; // Es una bandera para saber cuando se hizo la representacion, y se guardo bien. La usamos para despues poder mostrar o no algunas cosas
  mensajesFormularioRepresentacion: string[] = []; // Guardamos el mensaje que se va a mostrar tras guardar el formulario.

  confirmarCambioDeEstado: boolean = false; // Bandera para mostrar vista de confirmacion antes de cambiar un estado.
  paramsConfirmacion = {
    // Con estos datos se parametriza la vista de confirmacion antes de cambiar el estado.
    titulo: '',
    pregunta: '',
    boton: '',
    accion: '',
    msjExito: '',
  };

  objPostRechazarEvidencia = {
    contracargo_id: '',
    etapa_id: 0,
    observaciones: '',
  };

  rolEjecutivo: boolean = false; //bandera, asumimos que no es true, pero esto se pondra en true si al renderizar el componente se comprueba que es el rol ejecutivo. luego con esta variable condicionamos que mostrar y que no.

  criteriosValidacionCasoSeleccionado: CriterioValidacionForm[] = [];
  grupoMccCasoSeleccionado: string = ''

  caseEvidence: DocumentoGetEvidencia[] = [];
  isLoadingEvidence: boolean = false;
  isLoadingCriterios: boolean = false;

  readonly EstadosMenuButtons = [
    { visibleText: "Todos", buttonNumber: 1 },
    { visibleText: "Debitar", buttonNumber: 2 },
    { visibleText: "Abonar", buttonNumber: 3 },
    { visibleText: "Cerrar", buttonNumber: 4 },
    { visibleText: "Representar", buttonNumber: 5 },
    { visibleText: "Gestionar", buttonNumber: 6 },
  ]



  /* DASHBOARD ADMIN */
  contracargosDashboard: any[] = [
    // Ejemplo de datos
    {
      id: 1,
      idMarca: 1231237113,
      nombreMarca: 'VISA',
      idEtapa: 1,
      nombreEtapa: 'Pre - Arbitraje',
      idEstado: 6,
      nombreEstado: 'Pre Arbitrado',
      diasCierre: 16  //suponiendo q visa tiene tope 30
    },
    {
      id: 2,
      idMarca: 665316933,
      nombreMarca: 'MASTERCARD',
      idEtapa: 2,
      nombreEtapa: 'Contracargo',
      idEstado: 8,
      nombreEstado: 'Abonado',
      diasCierre: 19 //suponiendo q mastercard tiene tope 45
    },
    {
      id: 3,
      idMarca: 119900062,
      nombreMarca: 'MASTERCARD',
      idEtapa: 3,
      nombreEtapa: 'Disputa',
      idEstado: 5,
      nombreEstado: 'Disputado',
      diasCierre: 30 //suponiendo q mastercard tiene tope 45
    },
    {
      id: 4,
      idMarca: 5455566122,
      nombreMarca: 'MASTERCARD',
      idEtapa: 4,
      nombreEtapa: 'Contracargo',
      idEstado: 3,
      nombreEstado: 'Debitado',
      diasCierre: 14 //suponiendo q mastercard tiene tope 45
    },
    {
      id: 5,
      idMarca: 665316933,
      nombreMarca: 'VISA',
      idEtapa: 5,
      nombreEtapa: 'Arbitraje',
      idEstado: 7,
      nombreEstado: 'Arbitrado',
      diasCierre: 5 //suponiendo q mastercard tiene tope 45
    }
  ];

  estadosCabecera = [
    { id: 1, nombre: 'Recibido' },
    { id: 2, nombre: 'Notificado a Comercio' },
    { id: 3, nombre: 'Debitado' },
    { id: 4, nombre: 'Respuesta' },
    { id: 5, nombre: 'Disputado' },
    { id: 6, nombre: 'Pre Arbitrado' },
    { id: 7, nombre: 'Arbitrado' },
    { id: 8, nombre: 'Abono' },
    { id: 9, nombre: 'Cierre' }
  ];


  calcularProgreso(contracargo: any): number {
    const totalDias = contracargo.nombreMarca.toLowerCase() === 'visa' ? 30 : 45;
    return (contracargo.diasCierre / totalDias) * 100;
  }

  getProgressClass(contracargo: any): string {
    const totalDias = contracargo.nombreMarca.toLowerCase() === 'visa' ? 30 : 45;
    const progreso = contracargo.diasCierre / totalDias;
    if (progreso <= 0.33) {
      return 'green';
    } else if (progreso <= 0.66) {
      return 'yellow';
    } else {
      return 'red';
    }
  }







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

  this.resetPage()
  this.objGetContracargo = {
    ...this.objGetContracargo,
    busqueda_avanzada: finalVal,
  };
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

  async clickAmpliarPlazoGestion() {

  this.loadingCambioEstado = true;

  let parms = {
    contracargo_id: this.casoSeleccionado.caso
  }

  try {

    //TODO: Manejar respuesta de cuando el plazo ya fue extendido

    let response = await this.ampliarPlazoGestionService.postAmpliarPlazoGestion(parms);

    if (response.status === 'OK') {
      // Lo hacemos para que luego al mapearse la tabla del historial se vea el registro con otro color.
      this.representacionBody.statusFinal = 200;
      this.representacionBody.cantEstadosNuevos = [1];
      this.representacionBody.value = false; // Para que se entienda que este caso ya no esta dentro de los IDs permitidos para gestioanr.

      this.casoSeleccionado.estado = "Notificado Plazo Extendido";
      this.casoSeleccionado.puedeExtenderPlazo = true;
      // this.casoSeleccionado.estadoId = estadoIdNuevo;

      // Actualizar tabla historial caso y el estado del caso seleccionado, para que se vea ese cambio en la modal
      await this.traerHistorialCaso(this.casoSeleccionado.caso);

      this.gestionCaso('EL PLAZO DE GESTION FUE EXTENDIDO CORRECTAMENTE!');
      this.changeConfirmarCambioDeEstado('', '', '', '', '');
    }

  } catch (error) {
    console.error('Error:', error);
  }

  this.loadingCambioEstado = false;

}

// FUNCIONES PARA MANEJAR LA LOGICA DE LAS DEPENDENCIAS DE LOS FORMULARIOS

// La llamamos en los inputs dependientes para obtener el selected_value del input padre.
buscarValorSeleccionadoInputPadre(campoActual: any) {
  // Buscamos el input dependiente padre del input actual.
  let campoDependiente = this.jsonFormulario.etapa_campos.find(
    (campo: any) => campo.id === campoActual.dependencia.id
  );

  if (!campoDependiente) return [];
  let respuesta = [];
  if (campoDependiente.tipo == 'checkbox') {
    // si el checkbox no tiene opciones, es de los que son unicas opciones.
    // validamos si esta unica opcion es true
    if (campoDependiente.options.length == 0 && campoDependiente.selected_value.input[0]) {
      // un null ya que luego la comparacion con el valor 'dependencia_opcion_id'del input hijo va a ser null
      return ['null']
    }
    // es un checkbox con opciones entonces tenemos que recorrer todas las opciones
    for (let i = 0; i < campoDependiente.options.length; i++) {
      if (campoDependiente.selected_value.input[i] === true) {
        //si la opcion es true guardamos en el array
        let auxId = campoDependiente.id + '.' + (i + 1).toString(); //no podemos guardar true, sino que guardamos el id armado para luego hacer la comparacion.
        respuesta.push(auxId);
      }
    }
  } else if (
    campoDependiente.tipo == 'select' ||
    campoDependiente.tipo == 'radio'
  ) {
    if (campoDependiente.selected_value != '') {
      respuesta.push(campoDependiente.selected_value);
    }
  }
  return respuesta;
}

// Sirve para validar input tipo date, text y number.
validarHabilitarInputDependiente(campoActual: any) {
  // Traemos el selected value del input padre, o sea del que depende el input actual.
  let idComparar = this.buscarValorSeleccionadoInputPadre(campoActual);

  // Obtenemos un booleano de si coincide con alguna de las opciones posibles que pueda tener, y ahi habiltariamos el input.
  let res = campoActual.options.some((opc: any) =>
    idComparar.includes(opc.dependencia_opcion_id)
  );
  return res;
}

// Para valildar el input radio
validarHabilitarInputRadio(campoActual: any) {
  let selectedValuePadre =
    this.buscarValorSeleccionadoInputPadre(campoActual);

  if (selectedValuePadre.length > 0) {
    return true; // si hay algo seleccionado quiere decir que ya hay que habilitar este input.
  } else {
    return false;
  }
}

// Si el checkbox es dependiente, pero no tiene opciones, es de esos que es el label y true o false. Entonces aca validamos de otra manera, buscamos si el selected value del padre coincide con el id que indica en la dependencia de esta manera particular.
validarHabilitarCheckbox(campoActual: any) {
  let campoDependiente = this.jsonFormulario.etapa_campos.find(
    (campo: any) => campo.id === campoActual.dependencia.id
  );

  if (campoDependiente.selected_value == campoActual.dependencia.opcion_id) {
    return true;
  } else {
    return false;
  }
}

// La llamamos para obtener un array auxiliar filtrado de las opciones disponibles para los select dependientes.
filtrarArrayOpciones(campoActual: any) {
  let arrayFiltrado = [];
  let selectedValuePadre =
    this.buscarValorSeleccionadoInputPadre(campoActual);

  // Esto para los casos en los que en realidad no tiene opciones, por ejemplo el checkbox. entonces retornamos el array vacio
  if (campoActual.options.length > 0) {
    // Filtramos un array, solo con las opciones que coincidan con el selected value del input padre.
    const opcionesFiltradas = campoActual.options.filter((opcion: any) =>
      selectedValuePadre.includes(opcion.dependencia_opcion_id)
    );

    arrayFiltrado = opcionesFiltradas;
  }

  return arrayFiltrado;
}

// Recibe el evento del componente de la lista desplegable, con el objeto de la opcion seleccionada.
onDropdownChange(campo: any, selectedValue: OptionListaDesplegable) {
  this.guardarOpcionSeleccionadaEnJSON(
    campo.campo_id,
    selectedValue.opcion_id
  );
}

// La llamamos para insertar en el json, en el campo indicado, el valor seleccionado de las listas desplegables
guardarOpcionSeleccionadaEnJSON(campoId: number, selectedValue: number) {
  // Recorremos todos los campos que trae el json, cuando coincide el id del campo, entramos y guardamos la opcion seleccionada.
  for (let i = 0; i < this.jsonFormulario.etapa_campos.length; i++) {
    if (this.jsonFormulario.etapa_campos[i].campo_id == campoId) {
      this.jsonFormulario.etapa_campos[i].selected_value = selectedValue;
      break;
    }
  }
}

formatearFecha: (fechaParam: string) => string = formatearFechaFn
formatearMonto: (monto: number) => string = formatearMontoFn

// Valida que no se eliga una fecha anterior mas grande a la posterior
validarFechas() {
  if (
    this.objGetContracargo.fecha_desde &&
    this.objGetContracargo.fecha_hasta &&
    this.objGetContracargo.fecha_desde > this.objGetContracargo.fecha_hasta
  ) {
    // MOSTRAR MENSAJE
  } else {
    this.resetPage();
    this.traerContracargos();
  }
}


actualizarFiltrosMarcaEstado(idsSeleccionados: FilterSelection) {
  this.objGetContracargo.marcas = idsSeleccionados.marcas;
  this.objGetContracargo.etapas = idsSeleccionados.etapas;
  this.objGetContracargo.estados = idsSeleccionados.estados;
  this.botonEstadoSeleccionado = 1;
  this.resetPage();
  this.traerContracargos(); //llamamos funcion para que se actualicen los datos de la tabla
}

actualizarFechaFiltroTabla(dias: number | undefined) {
  this.objGetContracargo.ultimos_dias = dias;
  this.resetPage();
  this.traerContracargos();
}

  private extractFilenameAndType(file: File) {
  const filename = file.name.split('.')[0];
  const file_type = file.type.split('/')[1];
  return { name: filename, file_type: file_type };
}

  private async generateEvidenceParams(): Promise < ParametroPostEvidencia > {
  const postEvidenciaParams: ParametroPostEvidencia = {
    contracargo_id: parseInt(this.casoSeleccionado.caso),
    etapa_id: parseInt(this.casoSeleccionado.etapaId),
    files: [],
    observacion: 'placeholder',
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString().split(',')[1]);
        } else {
          reject(new Error('Empty file'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  for(const file of this.selectedFiles) {
  if (!file) {

    continue;
  }

  const { name, file_type } = this.extractFilenameAndType(file);

  try {
    const fileData = await readFileAsync(file);
    postEvidenciaParams.files.push({ name, data: fileData, file_type });
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

return postEvidenciaParams;
  }

  // TODO: donde y como mostrar el mensaje en caso de error
  // que pasa cuando ya habia evidencia?
  // DEJAR EVIDENCIA COMO OPCIONAL
  async subirEvidenciaEnviarFormulario() {
  const postEvidenciaParams = await this.generateEvidenceParams();
  if (postEvidenciaParams.files.length === 0) {

    // this.mensajesFormularioRepresentacion = [
    //   'NO SE SELECCIONARON ARCHIVOS DE EVIDENCIA VÁLIDOS.',
    // ];
    return this.enviarJsonFormularioCompleto();
  }
  try {
    this.loadingFormulario = true;
    let response = await this.evidenciasService.createEvidence(
      postEvidenciaParams
    );
    this.loadingFormulario = false;
    if (response.status === 'OK') {
      this.jsonFormulario.path_evidencia = response.file_key;
      this.mensajesFormularioRepresentacion = [
        'EVIDENCIA CARGADA SATISFACTORIAMENTE.',
      ];
    } else {
      this.mensajesFormularioRepresentacion = [
        response.message.toUpperCase(),
      ];
    }
  } catch (error) {
    console.error('Error:', error);
    this.loadingFormulario = false;
  }
  this.enviarJsonFormularioCompleto();
}

// otro pecado
getMarcaId(marca: string): number {
  return marca.toLowerCase().startsWith("master") ? Marcas.Mastercard : Marcas.Visa;
}

  // enviamos el JSON del formulario con las opciones seleccionadas
  async enviarJsonFormularioCompleto() {
  //Formatear False y True de los input de tipo checkbox
  for (let i = 0; i < this.jsonFormulario.etapa_campos.length; i++) {
    if (this.jsonFormulario.etapa_campos[i].tipo == 'checkbox') {
      // Recorremos el array de inputs y lo formateamos a string y el output tambien. Siempre deberia venir como array el input y output.
      for (
        let j = 0;
        j < this.jsonFormulario.etapa_campos[i].selected_value.input.length;
        j++
      ) {
        this.jsonFormulario.etapa_campos[i].selected_value.input[j] =
          this.jsonFormulario.etapa_campos[i].selected_value.input[
            j
          ].toString();
        this.jsonFormulario.etapa_campos[i].selected_value.output[j] =
          this.jsonFormulario.etapa_campos[i].selected_value.input[j];
      }
    }
  }

  this.objSubirJsonFormulario.contracargo_id = parseInt(this.casoSeleccionado.caso);
  this.objSubirJsonFormulario.etapa_id = parseInt(this.casoSeleccionado.etapaId);
  this.objSubirJsonFormulario.id_interno_marca = parseInt(this.casoSeleccionado.marcaId);
  this.objSubirJsonFormulario.marca_id = this.getMarcaId(this.casoSeleccionado.marca);
  this.objSubirJsonFormulario.motivo_id = parseInt(this.casoSeleccionado.motivoId);
  this.objSubirJsonFormulario.opciones_json = this.jsonFormulario;
  this.objSubirJsonFormulario.opcion_portal_id =
    this.representacionBody.opcionPortalId;



  try {
    this.loadingFormulario = true;

    // Llamamos la api que trae el json para el formulario
    let response = await this.enviarJsonFormularioService.postJsonFormulario(
      this.objSubirJsonFormulario
    );

    if (response.message == 'Se guardó correctamente') {
      this.mensajesFormularioRepresentacion.push(
        this.representacionBody.mensajeExito
      );
      this.representacionBody.statusFinal = 200; // con esto, desde otra funcion, sabemos si la representacion fue exitosa para cambiar los estados
    } else if (
      response.message ==
      'El contracargo ya poseé una configuración de portal'
    ) {
      this.mensajesFormularioRepresentacion.push(
        response.message.toUpperCase()
      );
      this.representacionBody.statusFinal = 400;
    } else {
      this.representacionBody.statusFinal = 401;
    }

    this.representado = true; // nuestra bandera para saber que el caso ya se represento, indistinto como salio.
    this.loadingFormulario = false;
  } catch (error) {
    console.error('Error:', error);
  }
}

  // Funcion para hacer todos los cambios de estado
  // TODO: revisar estado nuevo
  async llamarCambioEstado(
  msjExito: string,
  mostrarMsj: boolean,
  accion: string,
  marca: string,
  etapaActual: string
) {


  let estadoIdNuevo: number = 0;
  let estadoNombreNuevo: string = '';
  this.loadingCambioEstado = true;

  if (marca === 'MASTERCARD') {
    if (accion === 'Notificar') {
      estadoIdNuevo = EstadosSGCO.CONTRACARGO_MASTERCARD_NOTIFICACION_PROGRAMADA;
      estadoNombreNuevo = 'Notificacion Programada';
    }
    if (accion === 'Cerrar') {
      estadoIdNuevo = EstadosSGCO.CONTRACARGO_MASTERCARD_CIERRE_PROGRAMADO;
      estadoNombreNuevo = 'Cierre Programado';
    }
    if (accion === 'Configurar') {
      if (etapaActual === 'Disputa') {
        estadoIdNuevo = EstadosSGCO.DISPUTA_MASTERCARD_CONFIGURADA;
      } else if (etapaActual === 'Pre-arbitraje') {
        estadoIdNuevo = EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_CONFIGURADO;
      }
      estadoNombreNuevo = 'Configurado';
    }
    if (accion === 'Programar') {
      if (etapaActual === 'Disputa') {
        estadoIdNuevo = EstadosSGCO.DISPUTA_MASTERCARD_PROGRAMADA;
      } else if (etapaActual === 'Pre-arbitraje') {
        estadoIdNuevo = EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_PROGRAMADO;
      }
      estadoNombreNuevo = 'Programado';
    }

    // este caso particular no llevó formulario entonces fue un cambio de estado manual
    if ((accion === 'Arbitrar')) {
      estadoIdNuevo = EstadosSGCO.ARBITRAJE_MASTERCARD_ARBITRADO;
      estadoNombreNuevo = 'Arbitrado';
    }

    // este otro caso particular de aceptar prearbitraje mastercard
    if ((accion === 'Aceptar Prearbitraje Mastercard')) {
      estadoIdNuevo = this.ACEPTAR_PRE_ARBITRAJE_MASTERCARD_NUEVO_ESTADO;
      // estadoIdNuevo = EstadosContracargo.DISPUTA_MASTERCARD_POR_ACEPTAR
      estadoNombreNuevo = 'Disputa por Aceptar';
    }
  } else if (marca === 'VISA') {
    if (accion === 'Notificar') {
      estadoIdNuevo = EstadosSGCO.CONTRACARGO_VISA_NOTIFICACION_PROGRAMADA;
      estadoNombreNuevo = 'Notificacion Programada';
    }
    if (accion === 'Cerrar') {
      estadoIdNuevo = EstadosSGCO.CONTRACARGO_VISA_CIERRE_PROGRAMADO;
      estadoNombreNuevo = 'Cierre Programado';
    }
    if (accion === 'Configurar') {
      estadoIdNuevo = EstadosSGCO.PRE_ARBITRAJE_VISA_CONFIGURADO;
      estadoNombreNuevo = 'Configurado';
    }
    if (accion === 'Programar') {
      estadoIdNuevo = EstadosSGCO.PRE_ARBITRAJE_VISA_PROGRAMADO;
      estadoNombreNuevo = 'Programado';
    }
    if ((accion === 'Arbitrar')) {
      estadoIdNuevo = EstadosSGCO.ARBITRAJE_VISA_ARBITRADO;
      estadoNombreNuevo = 'Arbitrado';
    }
  }

  this.objCambioEstado = {
    contracargo_id: parseInt(this.casoSeleccionado.caso, 10),
    estado_final: estadoIdNuevo,
  };



  try {
    // Llamamos la api de cambio de estado
    let response = await this.cambioEstadoService.putCambioEstado(
      this.objCambioEstado
    );

    // Si el estado fue modificado correctamente
    // TODO: revisar cuando arreglen el servicio
    if (response.message == 'Estado contracargo modificado correctamente.') {
      // Este es un flujo que solo entra cuando a esta funcion la llamas para hacer un cambio de estado a traves de un boton por ejemplo.
      if (mostrarMsj) {
        // hacemos esto ya que hay casos que esta funcion solo se va a llamar como cambio de estado, sin mostrar msj de exito

        // Lo hacemos para que luego al mapearse la tabla del historial se vea el registro con otro color.
        this.representacionBody.statusFinal = 200;
        this.representacionBody.cantEstadosNuevos = [1];
        this.representacionBody.value = false; // Para que se entienda que este caso ya no esta dentro de los IDs permitidos para gestioanr.

        this.casoSeleccionado.estado = estadoNombreNuevo;
        this.casoSeleccionado.estadoId = estadoIdNuevo;

        // Actualizar tabla historial caso y el estado del caso seleccionado, para que se vea ese cambio en la modal
        await this.traerHistorialCaso(this.casoSeleccionado.caso);

        this.gestionCaso(msjExito);
        this.changeConfirmarCambioDeEstado('', '', '', '', '');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  this.loadingCambioEstado = false;
}

  // La llamamos cuando se aprieta el boton Entendido al finalizar la representacion, cerramos la modal, etc.
  async clickCerrarModalRepresentacion() {
  this.loadingFormulario = true;

  // Valido si la representacion se guardó bien, osea si se guardo correctamente el formulario de disputa por ejemplo
  if (this.representacionBody.statusFinal == 200) {
    // Cambiamos el estado del caso seleccionado, solo para que se vea el cambio en los datos de la modal. Luego se cierra la modal y desaparece.
    this.casoSeleccionado.estado = this.representacionBody.nuevoEstado;
    this.casoSeleccionado.estadoId = this.representacionBody.nuevoEstadoId;

    // Dentro de un try con await asi primero se hacen los cambios de estado y luego lo otro
    try {

      if (this.representacionBody.cabeceraConfig != 'Aceptar Pre-Arbitraje') {

        // Cambios de estado correspondientes.
        await this.llamarCambioEstado(
          '',
          false,
          'Configurar',
          this.casoSeleccionado.marca,
          this.casoSeleccionado.etapaDesc
        );
        await this.llamarCambioEstado(
          '',
          false,
          'Programar',
          this.casoSeleccionado.marca,
          this.casoSeleccionado.etapaDesc
        );
      }
      else {
        await this.llamarCambioEstado(
          '',
          false,
          'Aceptar Prearbitraje Mastercard',
          this.casoSeleccionado.marca,
          this.casoSeleccionado.etapaDesc
        );
      }

      // Actualizamos los datos del historial
      await this.traerHistorialCaso(this.casoSeleccionado.caso);
    } catch (error) {

    }
  }

  this.loadingFormulario = false;
  this.changeModalDocYForm();
}

// La llamamos cada vez que se cierra la modal con la cruz.
clickCerrarModalGestion() {
  if (this.estadosGestionar.includes(this.casoSeleccionado.estadoId)) {
    this.limpiarObjetoParametrosRepresentacion(); // Limpia el objeto que se usa para parametrizar toda la vista de representacion
  }

  this.limpiezaDatosCasoSeleccionado(); // limpia el caso seleccionado y el historial del caso

  // El caso o se represento o era por representar. Hay que limpiar estas cosas, porque si se empezo a representar y se echo para atras de todas maneras hay que limpiar todo por mas que no se represento.
  // Solo si el caso fue gestionar, si fue VER, solo se hace lo de arriba.
  // if (this.representacionBody.statusFinal == 200) {
  this.resetPage();
  this.traerContracargos(); // traemos los contracargos porque puede que haya habido un cambio
  this.traerIndicadores(); // actualizamos tambien los indicadores.
  this.limpiarObjCambioEstado();
  this.representado = false;
  this.mensajesFormularioRepresentacion = [];
  // }

  this.changeModalGestionarCaso(); // cerramos la modal de gestion
}

clickOperacionesTabla(caso: Contracargo) {


  // Solo lo hacemos para cuando corresponde.
  if (this.estadosGestionar.includes(caso.estadoId)) {
    this.obtenerDatosDeRepresentacion(
      caso.estadoId,
      caso.marca,
      caso.motivoCodigo,
      caso.motivoId
    );
  }

  this.cambiarCasoSeleccionado(caso);
  this.changeModalGestionarCaso();
  this.traerHistorialCaso(caso.caso);
}

// Guardamos o limpiamos el caso seleccionado
cambiarCasoSeleccionado(casoSelec: Contracargo) {
  this.casoSeleccionado = { ...casoSelec };
}

// Limpiar el caso seleccionado
limpiarCasoSeleccionado() {
  // Creamos un objeto de contracargo vacio
  let obj = getDefaultContracargo();

  // Llamamos a la funcion para limpiar los campos del caso seleccionado
  this.cambiarCasoSeleccionado(obj);
  this.criteriosValidacionCasoSeleccionado = [];
  this.grupoMccCasoSeleccionado = '';
}

// Limpia el objeto que usamos para los cambios de estado
limpiarObjCambioEstado() {
  let obj = {
    contracargo_id: 0,
    estado_final: 0,
  };

  this.objCambioEstado = { ...obj };
}

limpiarJson() {
  this.jsonFormulario = '';
}

// funcion que llamamos para limpiar datos
limpiezaDatosCasoSeleccionado() {
  this.limpiarCasoSeleccionado();
  this.limpiarHistorialCaso();
}

// limpia el array con los registros de historial del caso seleccionado
limpiarHistorialCaso() {
  this.historialCaso = [];
}


// Limpiamos los datos del objeto que usamos para parametrizar la representacion
limpiarObjetoParametrosRepresentacion() {
  this.representacionBody = { ...this.OBJ_REPRESENTACION_BODY };
}

  // FUNCIONES TRAER INFORMACION // FUNCIONES TRAER INFORMACION // FUNCIONES TRAER INFORMACION // FUNCIONES TRAER INFORMACION

  // Funcion reutilizable para actualizar los contracargos, cada vez que sea necesario
  async traerContracargos() {
  this.loadingTablaContracargos = true;

  try {
    // Traemos los contracargos
    this.objResContracargos = await this.contracargosService.getContracargos(
      this.objGetContracargo
    );

    this.contracargos = this.objResContracargos.contracargos;
    this.paginationConfig = {
      ...this.paginationConfig,
      elementCount: this.objResContracargos.total,
    };
    this.loadingTablaContracargos = false;
  } catch (error) {
    console.error('Error:', error);
  }
  this.isAlertasNavigation = false;
}

  // Funcion reutilizable para actualizar los indicadores, cada vez que sea necesario
  async traerIndicadores() {
  try {
    // Traemos los indicadores
    this.objResIndicadores = await this.indicadoresService.getIndicadores(
      this.objGetIndicadores
    );
    this.indicadores = this.objResIndicadores.indicadores;

  } catch (error) {
    console.error('Error:', error);
  }
}

  // Funcion para traer la lista de comercios
  async traerListaComercios() {
  try {
    // Traemos los indicadores
    // let resApi = await this.listaComerciosService.getListaComercios();
    // this.listaComercios = this.objResIndicadores.body.indicadores.detalles;
  } catch (error) {
    console.error('Error:', error);
  }
}

  // trae el historial del caso
  async traerHistorialCaso(idContracargo: string) {
  this.objGetHistorialCaso.contracargo_id = idContracargo;
  this.loadingTablaHistorial = true;

  try {
    // Llamamos la api que trae el json para el formulario
    let response = await this.traerHistorialDelCasoService.getHistorialCaso(
      this.objGetHistorialCaso
    );


    this.historialCaso = response.historialContracargos ?? [];
    this.loadingTablaHistorial = false;
  } catch (error) {
    console.error('Error:', error);
  }
}

  // traemos la evidencia del contracargo
  async traerEvidenciasPath() {
  let parametro: ParametroGetEvidencia = {
    etapa_id: parseInt(this.casoSeleccionado.etapaId),
    contracargo_id: parseInt(this.casoSeleccionado.caso),
  };

  let ruta = '';

  try {
    // Llamamos la api que trae la evidencia del caso
    let response = await this.evidenciasService.getEvidencia(parametro);

    if (response.status === ResponseStatus.ok) {
      ruta = response.body.s3_path; //guardamos el path
      this.caseEvidence = response.body.documento;
    }
  } catch (error) {
    console.error('Error:', error);
  }



  if (ruta) {
    this.jsonFormulario.path_evidencia = ruta;
  }

  return ruta;
}

  get mostrarRecomendacionGenerarCriterios() {
  if (!this.jsonFormulario) {
    return false;
  }
  return (
    this.criteriosValidacionCasoSeleccionado.length === 0 &&
    !this.isLoadingCriterios
  );
}

  //TODO: deshabilitar boton continuar si esto es true
  get tieneCriteriosPorValidar() {
  return (
    this.criteriosValidacionCasoSeleccionado.filter(
      (ele) => ele.obligatorio && !ele.validado
    ).length > 0
  );
}

  get deshabilitarBotonContinuar() {
  if (this.etapaFormulario === 1) {
    return this.tieneCriteriosPorValidar || this.loadingFormulario;
  }
  return false;
}

  async traerCriteriosValidacion() {
  let parametro = {
    contracargo_id: parseInt(this.casoSeleccionado.caso),
    // contracargo_id: 782961,
  };
  try {
    let respuesta =
      await this.criteriosValidacionService.getCriteriosValidacionCbk(
        parametro
      );
    this.grupoMccCasoSeleccionado = respuesta.grupoMcc;
    if (respuesta.criterioValidacion) {
      this.criteriosValidacionCasoSeleccionado =
        respuesta.criterioValidacion.map((cv) => {
          return { validado: false, ...cv };
        });
    }
  } catch (error) {

  }
}

  async traerEvidenciaCaso() {
  this.isLoadingEvidence = true;
  await this.traerEvidenciasPath();
  this.isLoadingEvidence = false;
}

  async traerCriteriosCaso() {
  this.isLoadingCriterios = true;
  await this.traerCriteriosValidacion();
  this.isLoadingCriterios = false;
}

  // traemos JSON con formulario
  async traerJsonFormulario() {
  try {
    this.loadingFormulario = true;
    this.objTraerJsonFormulario.etapa_id =
      this.representacionBody.etapaIdJson;
    this.objTraerJsonFormulario.motivo_id =
      this.representacionBody.codMotivoJson;

    // Llamamos la api que trae el json para el formulario
    let response = await this.jsonFormularioService.getJsonFormulario(
      this.objTraerJsonFormulario
    );
    this.objResTraerJsonFormulario.message = response.message; //lo hago asi ya que response no viene siempre con la misma estructura y si se lo asigno a la variable, en los casos en los que response solo sea un message se va a romper. la api deberia devolver siempre la misma estructura.
    this.objResTraerJsonFormulario.data = response.data;

    this.jsonFormulario = this.objResTraerJsonFormulario.data;

    // Solo vamos a convertirlo a OBJETO cuando no sea undefined, o sea cuando venga bien el JSON.
    if (typeof this.jsonFormulario != 'undefined') {
      this.jsonFormulario = JSON.parse(this.jsonFormulario); //lo convertimos a object

      if (!this.representacionBody.soloFormulario) {
        await Promise.all([
          this.traerEvidenciaCaso(),
          this.traerCriteriosCaso(),
        ]);
      }
    }
    this.loadingFormulario = false;

    // nota: hay que validar que sea la primere vez y no edicion, si es edicion, los selected_value de los checkbox convertirlos a booleano.
  } catch (error) {
    console.error('Error:', error);
    this.loadingFormulario = false;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funcion para recorrer el historial del caso, y ver si hay algun estado Por Gestionar, ahi sabemos NO va a tener que ver y validar evidencia.
validarEstadoPorGestionarEnHistorialCaso() {
  // Recorremos el historial del caso
  let encontradaPorGestionar = false;
  let objeto = {
    etapasDisponibles: 0,
    etapaValidarEvidencia: { valor: false, pos: 0 },
    etapaFormulario: { valor: false, pos: 0 },
    etapaCargaEvidencia: { valor: false, pos: 0 },
    edicionCaso: false, //con esto luego podemos validar si se abrio el caso en modo edicion y no de carga inicial
  };

  for (const element of this.historialCaso) {
    if (element.estado === 'Por Gestionar') {
      encontradaPorGestionar = true;
      break;
    }
  }

  // Si en el historial hay algún estado Por gestionar, NO va a validar la evidencia.
  if (encontradaPorGestionar) {
    // Si es true quiere decir que al menos un Por Gestionar hay, NO revisa evidencia.
    objeto.etapasDisponibles = 2;
    objeto.etapaValidarEvidencia = { valor: false, pos: 0 };
    objeto.etapaFormulario = { valor: true, pos: 1 };
    objeto.etapaCargaEvidencia = { valor: true, pos: 2 };
    objeto.edicionCaso = false;
  }
  if (this.representacionBody.soloFormulario) {
    // tambien validamos esto, si es true, solo va el formulario
    objeto.etapasDisponibles = 1;
    objeto.etapaValidarEvidencia = { valor: false, pos: 0 };
    objeto.etapaFormulario = { valor: true, pos: 1 };
    objeto.etapaCargaEvidencia = { valor: false, pos: 0 };
    objeto.edicionCaso = false;
  } else {
    objeto.etapasDisponibles = 3;
    objeto.etapaValidarEvidencia = { valor: true, pos: 1 };
    objeto.etapaFormulario = { valor: true, pos: 2 };
    objeto.etapaCargaEvidencia = { valor: true, pos: 3 };
    objeto.edicionCaso = false;
  }

  return objeto;
}

// Funcion para saber si el boton de la tabla va a ser GESTIONAR O VER
obtenerNombreBotonOperaciones(idEstado: number) {
  // Función para determinar el nombre del botón
  if (this.estadosGestionar.includes(idEstado)) {
    return 'Gestionar';
  } else {
    return 'Ver';
  }
}

// Funcion para saber que representacion corresponde y poder parametrizar t0do. Apenas se selecciona el registro de la tabla
// TODO: manejar estados que se encuentran en estadosGestionar y que faltan aca
// ej: prearbitraje mastercard por gestionar
obtenerDatosDeRepresentacion(
  idEstado: number,
  marca: string,
  motivoCodigo: string,
  motivoId: string
) {
  let motivoAux;

  // idEstado = this.ACEPTAR_PRE_ARBITRAJE_MASTERCARD_PREVIO;

  // Validamos que el id de estado que viene como parametro (el del caso seleccionado) sea un id que se podra gestionar.
  if (this.estadosGestionar.includes(idEstado)) {
    this.representacionBody.value = true;
    this.representacionBody.cantEstadosNuevos = [1, 2]; // en ambos casos se actualizaran 2 estados al final

    if (marca == 'MASTERCARD') {
      if (
        idEstado == EstadosSGCO.DISPUTA_MASTERCARD_POR_DISPUTAR ||
        idEstado == EstadosSGCO.CONTRACARGO_MASTERCARD_POR_GESTIONAR
      ) {
        this.representacionBody.nombreBotonIniciar = 'Iniciar Disputa';
        this.representacionBody.nombreBotonGuardar = 'Guardar y Disputar';
        this.representacionBody.cabeceraConfig = 'Configurar Disputa';
        this.representacionBody.msjValidarEvidencia =
          'Para iniciar con la Disputa debes revisar/validar la evidencia.';
        this.representacionBody.tituloFormulario =
          'CONFIGURAR DISPUTA MASTERCARD';
        this.representacionBody.etapaIdJson = 3;
        this.representacionBody.opcionPortalId = 2;
        this.representacionBody.codMotivoJson = null;
        this.representacionBody.mensajeExito =
          'SE HA CONFIGURADO LA DISPUTA MASTERCARD';
        this.representacionBody.nuevoEstado = 'Disputa Programada';
        this.representacionBody.nuevoEstadoId =
          EstadosSGCO.DISPUTA_MASTERCARD_PROGRAMADA
      } else if (
        idEstado == EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_POR_PRE_ARBITRAR ||
        // TODO: validar
        idEstado == EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_POR_GESTIONAR
      ) {
        this.representacionBody.nombreBotonIniciar = 'Iniciar Pre-Arbitraje';
        this.representacionBody.nombreBotonGuardar = 'Guardar y Pre Arbitrar';
        this.representacionBody.cabeceraConfig = 'Configurar Pre-Arbitraje';
        this.representacionBody.msjValidarEvidencia =
          'Para iniciar con el Pre Arbitraje debes revisar/validar la evidencia.';
        this.representacionBody.tituloFormulario =
          'CONFIGURAR PRE ARBITRAJE MASTERCARD';
        this.representacionBody.etapaIdJson = 4;
        this.representacionBody.opcionPortalId = 4;
        this.representacionBody.codMotivoJson = null;
        this.representacionBody.mensajeExito =
          'SE HA CONFIGURADO EL PREARBITRAJE MASTERCARD';
        this.representacionBody.nuevoEstado = 'Pre Arbitraje Programado';
        this.representacionBody.nuevoEstadoId =
          EstadosSGCO.PRE_ARBITRAJE_MASTERCARD_PROGRAMADO
      } else if (
        idEstado == EstadosSGCO.ARBITRAJE_MASTERCARD_POR_ARBITRAR ||
        idEstado == EstadosSGCO.ARBITRAJE_MASTERCARD_POR_GESTIONAR
      ) {
        this.representacionBody.nombreBotonIniciar = 'Iniciar Arbitraje';
        this.representacionBody.nombreBotonGuardar = 'Guardar y Arbitrar';
        this.representacionBody.cabeceraConfig = 'Configurar Arbitraje';
        this.representacionBody.msjValidarEvidencia =
          'Para iniciar con el Arbitraje debes revisar/validar la evidencia.';
        this.representacionBody.tituloFormulario =
          'INICIAR ARBITRAJE MASTERCARD';
        this.representacionBody.etapaIdJson = 0;
        this.representacionBody.opcionPortalId = 0;
        this.representacionBody.codMotivoJson = motivoAux;
        this.representacionBody.mensajeExito =
          'SE HA INIICIADO EL ARBITRAJE MASTERCARD';
        this.representacionBody.nuevoEstado = 'Arbitrado';
        this.representacionBody.nuevoEstadoId =
          EstadosSGCO.ARBITRAJE_MASTERCARD_ARBITRADO
      } else if (
        idEstado == this.ACEPTAR_PRE_ARBITRAJE_MASTERCARD_PREVIO
      ) {
        this.representacionBody.nombreBotonIniciar = 'Aceptar Pre-Arbitraje';
        this.representacionBody.nombreBotonGuardar =
          'Guardar y Aceptar Pre-Arbitraje';
        this.representacionBody.cabeceraConfig = 'Aceptar Pre-Arbitraje';
        this.representacionBody.msjValidarEvidencia =
          'Para iniciar con el Pre Arbitraje debes revisar/validar la evidencia.';
        this.representacionBody.tituloFormulario =
          'CONFIGURAR ACEPTAR PRE ARBITRAJE MASTERCARD';
        this.representacionBody.etapaIdJson = 14;
        this.representacionBody.opcionPortalId = 44;
        this.representacionBody.codMotivoJson = null;
        this.representacionBody.mensajeExito =
          'SE HA ACEPTADO EL PREARBITRAJE MASTERCARD';
        this.representacionBody.nuevoEstado = 'Disputa por Aceptar';
        this.representacionBody.nuevoEstadoId =
          this.ACEPTAR_PRE_ARBITRAJE_MASTERCARD_NUEVO_ESTADO;
        this.representacionBody.soloFormulario = true;
      }
    } else if (marca == 'VISA') {
      // Validamos el motivoId, si esta en la lista, es un caso de VISA prearbitraje pero otro formulario.
      if (this.motivosFormVisa2.includes(motivoCodigo)) {
        motivoAux = motivoId;
      } else {
        motivoAux = null;
      }

      if (idEstado == EstadosSGCO.PRE_ARBITRAJE_VISA_POR_PRE_ARBITRAR ||
        idEstado == EstadosSGCO.CONTRACARGO_VISA_POR_GESTIONAR
      ) {
        this.representacionBody.nombreBotonIniciar = 'Iniciar Pre-Arbitraje';
        this.representacionBody.nombreBotonGuardar = 'Guardar y Pre Arbitrar';
        this.representacionBody.cabeceraConfig = 'Configurar Pre-Arbitraje';
        this.representacionBody.msjValidarEvidencia =
          'Para iniciar con el Pre Arbitraje debes revisar/validar la evidencia.';
        this.representacionBody.tituloFormulario =
          'CONFIGURAR PRE ARBITRAJE VISA';
        this.representacionBody.etapaIdJson = 10;
        this.representacionBody.opcionPortalId = 34;
        this.representacionBody.codMotivoJson = motivoAux;
        this.representacionBody.mensajeExito =
          'SE HA CONFIGURADO EL PRE ARBITRAJE VISA';
        this.representacionBody.nuevoEstado = 'Pre Arbitraje Programado';
        this.representacionBody.nuevoEstadoId =
          EstadosSGCO.PRE_ARBITRAJE_VISA_PROGRAMADO;
      } else if (
        idEstado == EstadosSGCO.ARBITRAJE_VISA_POR_ARBITRAR ||
        idEstado == EstadosSGCO.ARBITRAJE_VISA_POR_GESTIONAR
      ) {
        this.representacionBody.nombreBotonIniciar = 'Iniciar Arbitraje';
        this.representacionBody.nombreBotonGuardar = 'Guardar y Arbitrar';
        this.representacionBody.cabeceraConfig = 'Configurar Arbitraje';
        this.representacionBody.msjValidarEvidencia =
          'Para iniciar con el Arbitraje debes revisar/validar la evidencia.';
        this.representacionBody.tituloFormulario = 'INICIAR ARBITRAJE VISA';
        this.representacionBody.etapaIdJson = 0;
        this.representacionBody.opcionPortalId = 0;
        this.representacionBody.codMotivoJson = motivoAux;
        this.representacionBody.mensajeExito =
          'SE HA INIICIADO EL ARBITRAJE VISA';
        this.representacionBody.nuevoEstado = 'Arbitrado';
        this.representacionBody.nuevoEstadoId = EstadosSGCO.ARBITRAJE_VISA_ARBITRADO; // esto de todas maneras no se usa ya que en este caso el cambio de estado es MANUAL por boton, no automatico al finalizar el formulario (porque no tiene) entonces en la funcion de cambio de estado se vuelve a asignar este valor. pero lo dejamos para mantener la estructura.
      }
    }
  }
}

// La llamamos cuando se presiona el boton de Representar, asi ya tenemos cargada la tabla de historial del caso y podemos ejecutar esto
obtenerEtapasVistaModalRepresentar() {
  this.representacionBody.etapas =
    this.validarEstadoPorGestionarEnHistorialCaso(); //obtenemos los parametros necesarios para saber como mostrar las vistas de la modal
  this.changeModalDocYForm();
}

// La llamamos cuando aprieta un boton de cambio de esado, cambia valor a variable que luego en el html muestra una confirmacion.
changeConfirmarCambioDeEstado(
  titulo: string,
  pregunta: string,
  boton: string,
  accion: string,
  msjExito: string
) {
  this.confirmarCambioDeEstado = !this.confirmarCambioDeEstado;
  this.paramsConfirmacion = {
    // Nos sirve para parametrizar la vista de confirmacion
    titulo: titulo,
    pregunta: pregunta,
    boton: boton,
    accion: accion,
    msjExito: msjExito,
  };

}

// Funcion para cuando se aprieta un boton de los estados rapidos
seleccionarBotonEstado(numero: number): void {
  this.botonEstadoSeleccionado = numero;

  // Asi nos queda en this.filtroSeleccionado el filtro de Marcas.
  this.objGetContracargo.marcas = this.marcasId;

  // Boton Todos
  if(this.botonEstadoSeleccionado == 1) {
  this.objGetContracargo.estados = [];
  this.objGetContracargo.etapas = [];
  this.objGetContracargo.marcas = [];
}
    // Boton Por Debitar
    else if (this.botonEstadoSeleccionado == 2) {
  //TODO: agregar debito programado
  this.objGetContracargo.estados = this.estadosDebitar;
}

// Boton Por Abonar
else if (this.botonEstadoSeleccionado == 3) {
  this.objGetContracargo.estados = this.estadosAbonar;
}

// Boton Por Cerrar
else if (this.botonEstadoSeleccionado == 4) {
  this.objGetContracargo.estados = this.estadosCerrar;
}

// Boton Por Representar
else if (this.botonEstadoSeleccionado == 5) {
  this.objGetContracargo.estados = this.estadosRepresentar;
}

// Boton Por Gestionar
else if (this.botonEstadoSeleccionado == 6) {
  this.objGetContracargo.estados = this.estadosGestionar;
}


this.initialSelection = {
  estados: this.objGetContracargo.estados,
  etapas: this.objGetContracargo.etapas,
  marcas: this.objGetContracargo.marcas,
};
this.resetPage();
this.traerContracargos();
  }

// Método que se llama en tu plantilla para condicionar la visualización del botón
validarRolYlogin() {
  try {
    // Verificar si hay un usuario en el localStorage al cargar el componente
    let { status, usuario } = this.dataStorageService.getUsuarioStorage();

    if (status && usuario.rol_id) {
      if (usuario.rol_id === UserRoles.Ejecutivo) {
        this.rolEjecutivo = true;
      }
    } else {
      location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

  // Ejecutamos al renderizar el componente
  async ngOnInit(): Promise < void> {
  this.traerFechaActual();

  this.route.queryParams.subscribe(params => {
    const paramsVal = params['estados'];
    if (paramsVal) {
      this.initialSelection = {
        ...this.initialSelection,
        estados: paramsVal.map((ele: string) => parseInt(ele)),
      }
      this.isAlertasNavigation = true;
      this.actualizarFiltrosMarcaEstado(this.initialSelection);
      const navigationExtras: NavigationExtras = {
        queryParams: {}
      };
      this.router.navigate([], navigationExtras);
    }
  });

  try {
    // Consumir o variables globales o storage y si no hay nada, redirigir al login.
    // this.validarRolYlogin();

    // Traemos los contracargos
    if(!this.isAlertasNavigation) {
  this.traerContracargos();
}

// Traemos los indicadores
this.traerIndicadores();


    } catch (error) {
  console.error('Error:', error);
}
  }

// Traer fecha actual
traerFechaActual() {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  let fechaActual = `${anio}-${mes}-${dia}`;
  this.objGetContracargo.fecha_hasta = fechaActual;
}

// Adjuntar archivos
selectedFiles: File[] = [];

  get evidenceFileInputDisabled() {
  return this.selectedFiles.length >= this.MAX_NUM_FILES_EVIDENCE;
}

  get submitFormDisabled() {
  return this.selectedFiles.length > this.MAX_NUM_FILES_EVIDENCE;
}

handleFileInput(event: any) {
  const files: FileList = event.target.files;
  for (let i = 0; i < files.length; i++) {
    this.selectedFiles.push(files[i]);
  }
}
borrarArchivo(index: number) {
  this.selectedFiles.splice(index, 1);
}

// Lista desplegable 2
listaDesplegable2: boolean = false;
toggleDropdown2() {
  this.listaDesplegable2 = !this.listaDesplegable2;
}

// Lista desplegable 3
listaDesplegable3: boolean = false;
toggleDropdown3() {
  this.listaDesplegable3 = !this.listaDesplegable3;
}

siguienteEtapa(etapa: number) {
  if (
    this.etapaFormulario < this.representacionBody.etapas.etapasDisponibles
  ) {
    this.etapaFormulario++;
  }
}

anteriorEtapa() {
  if (this.etapaFormulario > 1) {
    this.etapaFormulario--;
  }

}

// RECHAZAR EVIDENCIA
confirmacionRechazarEvidencia: boolean = false;
loadingRechazandoEvidencia: boolean = false;
msjRechazarEvidencia = { msj: '', estado: false, status: 0 };
confirmarRechazarEvidencia() {
  this.confirmacionRechazarEvidencia = !this.confirmacionRechazarEvidencia;
}
cambiarLoadingRechazandoEvidencia() {
  this.loadingRechazandoEvidencia = !this.loadingRechazandoEvidencia;
}

  async rechazarEvidencia() {
  this.cambiarLoadingRechazandoEvidencia();

  try {
    this.objPostRechazarEvidencia.etapa_id = parseInt(
      this.casoSeleccionado.etapaId
    );
    this.objPostRechazarEvidencia.contracargo_id = this.casoSeleccionado.caso;

    // Llamamos la api que rechaza la evidencia
    let response = await this.rechazarEvidenciaService.postRechazarEvidencia(
      this.objPostRechazarEvidencia
    );

    this.msjRechazarEvidencia.msj = response.body.message;
    this.msjRechazarEvidencia.estado = true;
    this.msjRechazarEvidencia.status = response.headers.statusCodeValue;

    this.confirmarRechazarEvidencia();
    this.cambiarLoadingRechazandoEvidencia();
  } catch (error) {
    console.error('Error:', error);
  }
}

  async cerrarRechazarEvidencia() {
  this.msjRechazarEvidencia.msj = '';
  this.msjRechazarEvidencia.estado = false;

  if (this.msjRechazarEvidencia.status == 200) {
    this.cambiarLoadingRechazandoEvidencia();

    // Cambiamos el estado del caso seleccionado, solo para que se vea el cambio en los datos de la modal. Luego se cierra la modal y desaparece.
    this.casoSeleccionado.estado = 'Evidencia Rechazada';
    // this.casoSeleccionado.estadoId = this.representacionBody.nuevoEstadoId;

    // Dentro de un try con await asi primero se hacen los cambios de estado y luego lo otro
    try {
      // Actualizamos los datos del historial
      await this.traerHistorialCaso(this.casoSeleccionado.caso);
    } catch (error) {

    }

    this.cambiarLoadingRechazandoEvidencia();
  }

  this.msjRechazarEvidencia.status = 0;
  this.limpiarObjPostRechazarEvidencia();
  this.changeModalDocYForm();
}

limpiarObjPostRechazarEvidencia() {
  this.objPostRechazarEvidencia.observaciones = '';
  this.objPostRechazarEvidencia.contracargo_id = '';
  this.objPostRechazarEvidencia.etapa_id = 0;
}

// VISUALIZADOR DE DOCUMENTOS
// constructor(private renderer: Renderer2) {}
// viewer: any;
imageSrc = '/assets/Evidencia1.png';
// ngOnInit() {
//   const img = this.renderer.selectRootElement('img');
//   this.viewer = new Viewer(img, {
//     inline: true,
//   });
//   this.viewer.zoomTo(1);
// }

changeModalDocYForm() {
  this.mostrarModalDocYForm = !this.mostrarModalDocYForm;
  this.isLoadingEvidence = this.mostrarModalDocYForm;
  this.isLoadingCriterios = this.mostrarModalDocYForm;
  this.etapaFormulario = 1; //si se abre o cierra la modal, siempre empieza por la etapa 1.
  this.selectedFiles = []; //se limpia todo
  this.caseEvidence = [];
  this.optionRadio = '';
  this.criteriosValidacionCasoSeleccionado = [];
  this.grupoMccCasoSeleccionado = '';
}

// Mensaje de exito
gestionCaso(mensaje: string) {
  this.cambioEstado = !this.cambioEstado;
  this.mensajeSatisfactorio = mensaje;
}

changeModalGestionarCaso() {
  this.mostrarModalGestionarCaso = !this.mostrarModalGestionarCaso;
  this.cambioEstado = false;
  this.mensajeSatisfactorio = '';

  // asi no queda pegado el boton de gestion
  this.representacionBody.value = true;
  this.representado = false;
}

// Lista desplegable comercios
listaDesplegable: boolean = false;
toggleDropdown() {
  this.listaDesplegable = !this.listaDesplegable;
}

// Funcion para cambiar el filtro seleccionado de los dias.
seleccionarBotonFiltro(botonNumero: number, dias: number): void {
  if(this.botonFechaSeleccionado == botonNumero) {
  this.botonFechaSeleccionado = 0;
  this.actualizarFechaFiltroTabla(undefined);
} else {
  this.botonFechaSeleccionado = botonNumero;
  this.actualizarFechaFiltroTabla(dias);
}
  }


getFilenameFromCbkParams() {
  return "samplefile.csv"
}

toggleModalConfirmarDescarga() {
  this.mostrarModalConfirmarDescarga = !this.mostrarModalConfirmarDescarga;
}

  async descargarContenidoVisible() {
  this.loadingDescarga = true;
  let resp = await this.descargaCsvService.descargarCbks(this.objGetContracargo);
  if (resp.body) {
    const fileName = this.getFilenameFromCbkParams();
    const contentType = "text/csv"
    const linkSource = `data:${contentType};base64,${resp.body}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click()
  }
  this.loadingDescarga = false;
  this.mostrarModalConfirmarDescarga = false;
}
}