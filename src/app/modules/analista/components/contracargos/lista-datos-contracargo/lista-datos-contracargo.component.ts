import { Component, Input } from '@angular/core';
import { formatearFecha as formatearFechaFn, formatearMonto as formatearMontoFn } from 'src/app/utils';
import { Contracargo } from 'src/models/contracargos/Contracargo';

@Component({
  selector: 'app-lista-datos-contracargo',
  templateUrl: './lista-datos-contracargo.component.html',
})
export class ListaDatosContracargoComponent {
  @Input() casoSeleccionado!: Contracargo;

  formatearFecha: (fechaParam: string) => string = formatearFechaFn
  formatearMonto:(monto: number) => string = formatearMontoFn

}
