import { Component } from '@angular/core';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
})
export class ConfigurationsComponent {
  // Boton de filtro ESTADO seleccionado
  botonMenuSeleccionado: number = 1;
  botonesConfig = [
    { botonNumber: 1, text: 'Comercio', marcaId: -1, marcaName: '' },
    {
      botonNumber: 2,
      text: 'Configuración VISA',
      marcaId: 2,
      marcaName: 'VISA',
    },
    {
      botonNumber: 3,
      text: 'Configuración MASTERCARD',
      marcaId: 1,
      marcaName: 'MASTERCARD',
    },
  ];
  marcaId: number =
    this.botonesConfig.find((x) => x.botonNumber === this.botonMenuSeleccionado)
      ?.marcaId ?? -1;
  marcaName: string =
    this.botonesConfig.find((x) => x.botonNumber === this.botonMenuSeleccionado)
      ?.marcaName ?? '';

  seleccionarBotonMenu(numero: number): void {
    this.botonMenuSeleccionado = numero;
    let configItem = this.botonesConfig.find((e) => e.botonNumber === numero);
    
    if (configItem) {
      this.marcaId = configItem.marcaId;
      this.marcaName = configItem.marcaName;
    }
  }
}
