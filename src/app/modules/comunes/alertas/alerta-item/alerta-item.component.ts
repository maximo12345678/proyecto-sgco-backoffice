import { Component, EventEmitter, Input, NgZone, Output, SimpleChanges } from '@angular/core';
import { interval } from 'rxjs';
import { AlertaItem } from '../AlertaItem';

@Component({
  selector: 'app-alerta-item',
  templateUrl: './alerta-item.component.html',
  styleUrls: ['./alerta-item.component.css']
})
export class AlertaItemComponent {
  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      interval(10000) 
        .subscribe(() => {
          this.ngZone.run(() => {
            this.formattedUpdatedAt = this.item.updatedAt;
          });
        });
    });
  }
  @Input() item!:AlertaItem; 
  @Input() isLoading:boolean = false; 

  @Output() gestionarClicked: EventEmitter<{
    id: number;
  }> = new EventEmitter();
  @Output() ocultarClicked: EventEmitter<{
    id: number;
  }> = new EventEmitter();

  formattedUpdatedAt: string = "";
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['item']) {
      return;
    }
    const previousValue = changes['item'].previousValue;
    if (!previousValue) {
      return;
    }
    const currentValue = changes['item'].currentValue;
    
    this.item = currentValue;
  }

  get visibleText(){
    return `${this.item.keyName} (${this.item.value})`
  }

  hideItem(){
    this.ocultarClicked.emit({id: this.item.id});
  }

  manageItem(){
    this.gestionarClicked.emit({id: this.item.id});
  }
}
