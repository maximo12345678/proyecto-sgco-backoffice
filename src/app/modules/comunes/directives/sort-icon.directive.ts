import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { fromEvent, throttleTime } from 'rxjs';

export interface SortChangedEvent {
  id: string;
  sortDirection: string;
}

@Directive({
  selector: '[appSortIcon]',
})
export class SortIconDirective implements OnChanges {
  @Input() id!: string;
  @Output() sortChanged: EventEmitter<{ id: string; sortDirection: string }> =
    new EventEmitter();
  disabled = false;

  private sortClasses: string[] = ['fa-sort', 'fa-sort-up', 'fa-sort-down'];
  private sortDirections: string[] = ['', 'ASC', 'DESC'];
  private currentClassIndex: number = 0;
  private readonly THROTTLE_TIME_MS = 700;

  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('fas', 'fa-sort');
    fromEvent(this.el.nativeElement, 'click')
      .pipe(throttleTime(this.THROTTLE_TIME_MS))
      .subscribe(() => this.onClick());
  }

  ngOnChanges(): void {
    this.disabled = !this.id;
    if (this.disabled) {
      this.el.nativeElement.classList.add('disabled');
    } else {
      this.el.nativeElement.classList.remove('disabled');
    }
  }

  onClick() {
    if (this.disabled) return;
    
    this.currentClassIndex =
      (this.currentClassIndex + 1) % this.sortClasses.length;
    const newClass = this.sortClasses[this.currentClassIndex];
    this.el.nativeElement.className = `fas ${newClass}`;
    const sortDirection = this.sortDirections[this.currentClassIndex];
    this.sortChanged.emit({ id: this.id, sortDirection });
  }

  reset() {
    if (this.disabled) return;
    this.currentClassIndex = 0;
    this.el.nativeElement.className = 'fas fa-sort';
  }
}
