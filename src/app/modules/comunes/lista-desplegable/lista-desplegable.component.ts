import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OptionListaDesplegable } from 'src/models/OptionListaDesplegable';


@Component({
  selector: 'app-lista-desplegable',
  templateUrl: './lista-desplegable.component.html',
  styleUrls: ['./lista-desplegable.component.css']
})


export class ListaDesplegableComponent{

  @Input() options: OptionListaDesplegable[] = []; //una entrada para las opciones y una propiedad de salida para emitir el valor seleccionado.
  @Input() inputDisabled: boolean = false;
  @Output() selectedValueChange = new EventEmitter<OptionListaDesplegable>();

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  

  selectedValue: OptionListaDesplegable = {
    opcion_id: 0,
    label: 'Seleccione una opcion',
    dependencia_opcion_id: null
  }


  onSelectOption(option: OptionListaDesplegable) {
    this.selectedValue = option;
    this.selectedValueChange.emit(option);
    this.isOpen = false; // Cierra la lista desplegable después de seleccionar una opción
  }
}



