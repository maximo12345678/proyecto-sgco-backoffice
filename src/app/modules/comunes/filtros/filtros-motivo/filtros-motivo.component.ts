import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FiltroEstadoMotivo,
  FiltroMarca,
  MotivoFilterSelection,
} from 'src/models/filtros/Filtro';
import { ESTADOS, MARCAS } from './filter-data';

enum FilterStage {
  initial,
  brandSelection,
  statusSelection,
}

@Component({
  selector: 'app-filtros-motivo',
  templateUrl: './filtros-motivo.component.html',
  styleUrls: ['./filtros-motivo.component.css'],
})
export class FiltrosMotivoComponent implements OnInit {
  @Input() initialSelection!: MotivoFilterSelection;
  @Output() onSelectionChange: EventEmitter<MotivoFilterSelection> =
    new EventEmitter<MotivoFilterSelection>();

  ngOnInit(): void {
    this.selections = this.initialSelection;
    
    this.updateDisplayedSelections();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['initialSelection']) {
      return;
    }
    const previousValue = changes['initialSelection'].previousValue;
    if (!previousValue) {
      return;
    }
    
    const currentValue = changes['initialSelection'].currentValue;
    this.selections = currentValue;
  }

  get selectAllMarcas(): boolean {
    return this.marcasValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllMarcas(value: boolean) {
    this.marcasValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedMarcas(): number {
    return this.marcasValues.filter((ele) => ele.selected).length;
  }

  get selectAllEstados(): boolean {
    return this.estadosValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllEstados(value: boolean) {
    this.estadosValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedEstados(): number {
    return this.estadosValues.filter((ele) => ele.selected).length;
  }

  updateDisplayedSelections() {
    this.marcasValues.forEach((element) => {
      if (this.selections.marcas.includes(element.id)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.estadosValues.forEach((element) => {
      if (this.selections.estados.includes(element.id)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
  }

  updateSelections() {
    
    switch (this.currentStage) {
      case this.stages.brandSelection:
        
        this.selections.marcas = this.marcasValues
          .filter((element) => element.selected)
          .map((v) => v.id);
        break;

      case this.stages.statusSelection:
        
        this.selections.estados = this.estadosValues
          .filter((element) => element.selected)
          .map((v) => v.id);
        break;

      default:
        break;
    }
    this.filterSelectionChanged();
  }

  marcasValues: FiltroMarca[] = MARCAS;
  estadosValues: FiltroEstadoMotivo[] = ESTADOS;

  stages = FilterStage;
  currentStage = this.stages.initial;
  mostrarModalFiltros = false;
  selections: MotivoFilterSelection = {
    marcas: [],
    estados: [],
  };

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.mostrarModalFiltros) return;
    const clickedElement = event.target as HTMLElement;

    if (!clickedElement) return;
    const isClickedInsideContainer =
      !!clickedElement.closest('.container-filtros');
    const isClickedOnFilterButton =
      clickedElement.classList.contains('filter-button');

    
    
    

    if (!isClickedInsideContainer && !isClickedOnFilterButton) {
      this.hideFilters();
    }
  }

  hideFilters() {
    
    this.mostrarModalFiltros = false;
  }

  toggleFilterPopup() {
    this.mostrarModalFiltros = !this.mostrarModalFiltros;
  }

  filterSelectionChanged() {
    
    this.onSelectionChange.emit(this.selections);
  }

  changeFilterStage(stage: FilterStage) {
    this.currentStage = stage;
  }

  clearSelections() {
    this.marcasValues.forEach((element) => (element.selected = false));
    this.selections.marcas = [];
    this.estadosValues.forEach((element) => (element.selected = false));
    this.selections.estados = [];
    this.updateSelections();
  }

  get numOffilteredCategories() {
    return (
      Number(this.numSelectedMarcas > 0) + Number(this.numSelectedEstados > 0)
    );
  }
}
