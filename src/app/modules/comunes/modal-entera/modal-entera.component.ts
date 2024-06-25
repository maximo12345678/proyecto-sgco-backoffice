import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-entera',
  templateUrl: './modal-entera.component.html',
  styleUrls: ['./modal-entera.component.css']
})
export class ModalEnteraComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() accionIrreversible: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() textoBotonOk: string = 'Sí, Guardar';
  @Output() confirmAction = new EventEmitter();
  @Output() cancelOperation = new EventEmitter();

  onCancelOperation() {
    this.cancelOperation.emit();
  }

  onConfirmAction() {
    this.confirmAction.emit();
  }

}
