import { Component, Input, OnDestroy } from '@angular/core';
import { Marcas } from 'src/app/constants';
import { ResponseStatus } from 'src/models/ApiCommons';
import { ConfigContador } from 'src/models/configuraciones/ConfiguracionContador';
import {
  ParamsGetConfigContadores,
  getDefaultRespuestaConfigContadores,
} from 'src/models/configuraciones/GetConfiguracionesContadores';
import {
  ConfigContadorPutParam,
  ParamsPutConfigContadores,
} from 'src/models/configuraciones/PutConfiguracionesContadores';
import { ConfiguracionContadoresService } from '../../../services/configuracion-contadores.service';

interface BooleanField {
  fieldName: string;
  fieldDescription: string;
  initialValue: boolean;
  value: boolean;
}

@Component({
  selector: 'app-config-marcas',
  templateUrl: './config-marcas.component.html',
  styleUrls: ['./config-marcas.component.css'],
})
export class ConfigMarcasComponent implements OnDestroy {
  readonly MIN_DIAS = 1;
  readonly MAX_DIAS = 999;
  readonly DEFAULT_SUCCESS_MESSAGE =
    'Configuracion actualizada satisfactoriamente.';
  readonly MARCA_ID_VISA = Marcas.Visa;

  @Input()
  get marcaName(): string {
    return this._marcaName;
  }
  set marcaName(v: string) {
    this._marcaName = v;
  }
  private _marcaName = '';

  @Input()
  get marcaId(): number {
    return this._marcaId;
  }
  set marcaId(marcaId: number) {
    this._marcaId = marcaId;
    this.paramsGet.marca_id = marcaId;
    this.paramsPut = { ...this.paramsGet, configuraciones: [] };
    this.traerConfiguraciones();
  }
  private _marcaId = -1;

  get configs(): ConfigContador[] {
    return this._configs;
  }

  set configs(values: ConfigContador[]) {
    this._configs = values;
    this._configs.sort((a, b) => a.id - b.id);
  }
  private _configs: ConfigContador[] = [];

  constructor(
    private gestionConfigContadores: ConfiguracionContadoresService
  ) {}

  ngOnDestroy(): void {
    this.modalTimeoutsIds.forEach((id) => clearTimeout(id));
  }

  loadingConfiguraciones: boolean = false;
  respuestaConfigContadores = getDefaultRespuestaConfigContadores();
  paramsGet: ParamsGetConfigContadores = {
    marca_id: this.marcaId,
  };

  resultMessage: string = '';
  sucessfulUpdate: boolean = false;
  showModal = false;
  modalTimeoutsIds: any[] = [];
  // NOTA: si se extrae a un componente, este timeout debe coincidir
  // con el que se use en transform en el .css
  defaultToastTimeout = 5000;

  booleanFields: BooleanField[] = [
    // {
    //   fieldName: 'usaFiltroAvanzadoVisa',
    //   fieldDescription:
    //     'Ocupar filtro avanzado en portal de VISA (Costo por uso 2,5 USD)',
    //   initialValue: false,
    //   value: false,
    // },
  ];

  usaFiltroAvanzado: boolean = false;

  paramsPut: ParamsPutConfigContadores = {
    ...this.paramsGet,
    configuraciones: [],
  };

  originalValues: ConfigContadorPutParam[] = [];
  async traerConfiguraciones() {
    this.loadingConfiguraciones = true;

    this.respuestaConfigContadores =
      await this.gestionConfigContadores.getConfigContadores(this.paramsGet);

    this.configs = this.respuestaConfigContadores.contadores;
    this.originalValues = this.configs.map((val) => {
      return { id: val.id, diasMaximos: val.diasMaximos };
    });
    this.loadingConfiguraciones = false;
  }

  async updateConfiguraciones() {
    this.loadingConfiguraciones = true;
    this.sucessfulUpdate = false;

    try {
      this.respuestaConfigContadores =
        await this.gestionConfigContadores.updateConfigContadores(
          this.paramsPut
        );

      if (this.respuestaConfigContadores.status !== ResponseStatus.ok) {
        this.resultMessage = this.respuestaConfigContadores.message;
      } else {
        this.resultMessage = this.DEFAULT_SUCCESS_MESSAGE;
        this.sucessfulUpdate = true;
      }
      this.showModal = true;

      this.modalTimeoutsIds.push(
        setTimeout(() => {
          this.showModal = false;
          this.resultMessage = '';
        }, this.defaultToastTimeout)
      );

      this.configs = this.respuestaConfigContadores.contadores;
      this.originalValues = this.configs.map((val) => {
        return { id: val.id, diasMaximos: val.diasMaximos };
      });
      this.booleanFields.forEach((ele) => (ele.initialValue = ele.value));
    } catch (error) {
      console.error('Error:', error);
    }

    this.loadingConfiguraciones = false;
  }

  get canSubmitForm() {
    const allValid =
      this.configs.filter((val) => !val.diasMaximos).length === 0;
    if (!allValid) {
      return false;
    }

    for (const element of this.configs) {
      const originalValue = this.originalValues.find(
        (val) => val.id === element.id
      );
      if (element.diasMaximos !== originalValue?.diasMaximos) {
        return true;
      }
    }
    const booleanChanged = this.booleanFields.find(
      (val) => val.value !== val.initialValue
    );
    if (booleanChanged) {
      return true;
    }
    return false;
  }

  restoreValues() {
    for (const element of this.configs) {
      const originalValue = this.originalValues.find(
        (val) => val.id === element.id
      );
      element.diasMaximos = originalValue!.diasMaximos;
    }
    this.booleanFields.forEach((ele) => (ele.value = ele.initialValue));
  }

  submitForm() {
    if (!this.canSubmitForm) {
      return;
    }
    this.configs.forEach((val) => console.log(val.diasMaximos));
    this.paramsPut.configuraciones = this.configs.map((val) => {
      return { ...val };
    });

    this.updateConfiguraciones();
  }

  closeModal() {
    this.showModal = false;
  }

  optionRadio: string = '';
}
