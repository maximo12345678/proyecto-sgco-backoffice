import { Component } from '@angular/core';

@Component({
  selector: 'app-monto-minimo',
  templateUrl: './monto-minimo.component.html',
  styleUrls: ['./monto-minimo.component.css']
})


export class MontoMinimoComponent {

  
  configuraciones: any[] = [{ comercio: '', opcion: '' }]; // Arreglo para almacenar las configuraciones

  agregarConfiguracion() {
    // Agregar una nueva configuración vacía al arreglo
    this.configuraciones.push({ comercio: '', opcion: '' });
  }

  eliminarConfiguracion(index: number) {
    // Eliminar una configuración del arreglo
    this.configuraciones.splice(index, 1);
  }



  // Lista desplegable comercios
  listaDesplegable: boolean = false;
  toggleDropdown() {
    this.listaDesplegable = !this.listaDesplegable;
  }


  // Input radio
  optionRadio: string = '';

}
