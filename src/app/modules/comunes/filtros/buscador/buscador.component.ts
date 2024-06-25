import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
})
export class BuscadorComponent implements OnInit {
  @Output() onSearchChange = new EventEmitter<string>();
  @Input() placeholder: string = "Buscar";
  @Input() debounceTimeMs: number = 500;
  @Input() inputWidthPx: number = 420;
  

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
      .subscribe((searchValue) => {
        this.onSearchChange.emit(searchValue.trim());
      });
  }

  private searchSubject = new Subject<string>();
  inputBuscador = '';

  onSearch() {
    this.searchSubject.next(this.inputBuscador);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
