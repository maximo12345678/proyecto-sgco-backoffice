import { Component, Input } from '@angular/core';
import { Indicador } from 'src/models/indicadores/Indicador';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css'],
})
export class IndicadoresComponent {
  @Input() indicador!: Indicador; // el operador '!' para indicar que estará definida

  formatearMonto(monto: string) {
    let convertido = parseInt(monto, 10); // Convierte el string a número entero

    return convertido.toLocaleString('es-ES'); // Utiliza la configuración regional para separar los miles
  }
}
