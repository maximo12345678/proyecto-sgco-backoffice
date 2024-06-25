import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfiguracionComercioService } from 'src/app/modules/admin/services/configuracion-comercio.service';
import { Comercio } from 'src/models/comercio/Comercio';
import { ParamsUpdateComercios } from 'src/models/comercio/UpdateComercio';

export interface ConfigOutput {
  id: number;
  monto: number;
}

@Component({
  selector: 'app-modal-gestion-config',
  templateUrl: './modal-gestion-config.component.html',
  styleUrls: ['./modal-gestion-config.component.css'],
})
export class ModalGestionConfigComponent implements OnInit {
  constructor(private configComercioService: ConfiguracionComercioService) {}
  ngOnInit(): void {
    this.montoInput = this.comercio.montoMinimo.toString();
    this.debitoInicialRadio = this.comercio.debitoInicial;
    let splits = this.comercio.nombre.split(' | ');
    if (splits.length === 2) {
      this.rutComercio = splits[0];
      this.nombreComercio = splits[1];
    }
  }
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() comercio!: Comercio;
  successfulUpdate = false;
  loadingUpdate = false;
  mensajeResultado = '';
  nombreComercio = '';
  rutComercio = '';

  montoInput = '';
  debitoInicialRadio = false;

  get isInputInvalid(): boolean {
    if (this.montoInput && !/^\d+$/.test(this.montoInput)) {
      return true; // Input is not a valid integer
    }
    let numericVal = parseInt(this.montoInput);
    return numericVal < 0;
  }

  get guardarDisabled(): boolean {
    return (
      this.isInputInvalid ||
      this.montoInput === '' || 
      this.loadingUpdate ||
      (parseInt(this.montoInput) === this.comercio.montoMinimo &&
        this.debitoInicialRadio === this.comercio.debitoInicial)
    );
  }

  closeModal() {
    
    this.closeModalEvent.emit();
  }

  async onClickGuardar() {
    if (this.isInputInvalid) {
      
      return;
    }
    this.loadingUpdate = true;
    this.successfulUpdate = false;
    let params: ParamsUpdateComercios = {
      comercio_ids: [this.comercio.id],
      debitos_iniciales: [this.debitoInicialRadio],
      montos_minimos: [parseInt(this.montoInput)],
    };

    
    let response = await this.configComercioService.updateComercios(params);
    
    this.mensajeResultado = response.message;
    if (response.status === 'OK') {
      this.successfulUpdate = true;
      this.comercio.montoMinimo = parseInt(this.montoInput);
    }
    this.loadingUpdate = false;
  }

  formatearMonto(monto: number) {
    return monto.toLocaleString('es-ES'); // Utiliza la configuración regional para separar los miles
  }
}
