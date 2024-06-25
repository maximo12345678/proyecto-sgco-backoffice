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
  FilterSelection,
  FiltroCbkConfig,
  FiltroEstado,
  FiltroEtapa,
  FiltroMarca,
} from 'src/models/filtros/Filtro';

enum FilterStage {
  initial,
  brandSelection,
  stageSelection,
  statusSelection,
}

@Component({
  selector: 'app-filtros-cbk',
  templateUrl: './filtros-cbk.component.html',
  styleUrls: ['./filtros-cbk.component.css'],
})
export class FiltrosCbkComponent implements OnInit {
  @Input() initialSelection!: FilterSelection;
  @Input() filtrosConfig!: FiltroCbkConfig;
  @Output() onSelectionChange: EventEmitter<FilterSelection> =
    new EventEmitter<FilterSelection>();

  ngOnInit(): void {
    const { estados, etapas, marcas, marcaMap, etapaMap } = this.filtrosConfig;
    this.marcasValues = marcas;
    this.estadosValues = estados;
    this.etapasValues = etapas;
    this.etapaMap = etapaMap;
    this.marcaMap = marcaMap;
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
    this.updateDisplayedSelections();
  }

  updateDisplayedSelections() {
    this.marcasValues.forEach((element) => {
      if (this.selections.marcas.includes(element.id)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.etapasValues.forEach((element) => {
      if (this.selections.etapas.includes(element.id)) {
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

  
  private _searchText : string = '';
  public get searchText() : string {
    return this._searchText;
  }
  public set searchText(v : string) {

    const regex = new RegExp(v.toLowerCase().split('').join('.*')); // Create a regex for subsequence matching
    this.estadosValues = this.filtrosConfig.estados.filter((ele) => {
      let txt = ele.visibleText ?? ele.text;
      return regex.test(txt.toLowerCase()) || ele.selected; // Test if the text matches the regex
    });
    this._searchText = v;
  }

  clearSearch() {
    this.searchText = '';
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

  get selectAllEtapas(): boolean {
    return this.etapasValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllEtapas(value: boolean) {
    this.etapasValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedEtapas(): number {
    return this.etapasValues.filter((ele) => ele.selected).length;
  }

  get selectAllEstados(): boolean {
    return this.estadosValues.length > 0 &&  this.estadosValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllEstados(value: boolean) {
    this.estadosValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedEstados(): number {
    return this.estadosValues.filter((ele) => ele.selected).length;
  }


  updateSelections() {
    
    switch (this.currentStage) {
      case this.stages.brandSelection:
        
        this.selections.marcas = this.marcasValues
          .filter((element) => element.selected)
          .map((v) => v.id);
        break;
      case this.stages.stageSelection:
        
        this.selections.etapas = this.etapasValues
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

  marcasValues: FiltroMarca[] = [];
  etapasValues: FiltroEtapa[] = [];
  estadosValues: FiltroEstado[] = [];
  marcaMap: { [id: number]: string } = {};
  etapaMap: { [id: number]: string } = {};

  stages = FilterStage;
  currentStage = this.stages.initial;
  mostrarModalFiltros = false;
  selections: FilterSelection = {
    marcas: [],
    etapas: [],
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
    
    this.searchText = "";
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
    this.searchText = "";
  }

  clearSelections() {
    this.marcasValues.forEach((element) => (element.selected = false));
    this.selections.marcas = [];
    this.etapasValues.forEach((element) => (element.selected = false));
    this.selections.etapas = [];
    this.estadosValues.forEach((element) => (element.selected = false));
    this.selections.estados = [];
    this.updateSelections();
  }

  get numOffilteredCategories() {
    return (
      Number(this.numSelectedMarcas > 0) +
      Number(this.numSelectedEtapas > 0) +
      Number(this.numSelectedEstados > 0)
    );
  }
}
