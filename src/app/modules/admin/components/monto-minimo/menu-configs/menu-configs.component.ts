import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-configs',
  templateUrl: './menu-configs.component.html',
})


export class MenuConfigsComponent {

  // Boton de filtro ESTADO seleccionado
  botonMenuSeleccionado: number = 1;

  seleccionarBotonMenu(numero: number): void {
    this.botonMenuSeleccionado = numero;
  }
  
}
