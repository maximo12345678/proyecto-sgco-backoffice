import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  elementCount: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() initialPaginationConfig!: PaginationConfig;
  @Input() isLoading!: boolean;
  @Input() hasResponse: boolean = false;

  @Output() onPageChange: EventEmitter<number> =
    new EventEmitter<number>();
  
  _paginationConfig: PaginationConfig = {
    currentPage: 0,
    pageSize: 0,
    elementCount: 0
  }

  registrosPorPagina = 10;
  totalRegistros = 0;
  paginaActual = 1;
  maxPaginasMostradas = 5;

  get paginationConfig(){
    return this._paginationConfig;
  }

  set paginationConfig(config: PaginationConfig){
   this._paginationConfig = config;
   this.registrosPorPagina = this._paginationConfig.pageSize;
   this.totalRegistros = this._paginationConfig.elementCount;
   this.paginaActual = this._paginationConfig.currentPage;
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalRegistros / this.registrosPorPagina);
  }

  get rangoInferior(): number {
    return this.registrosPorPagina * (this.paginaActual - 1) + 1;
  }

  get rangoSuperior(): number {
    return Math.min(
      this.registrosPorPagina * this.paginaActual,
      this.totalRegistros
    );
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.onPageChange.emit(this.paginaActual);
    }
  }

  // calcula dinámicamente los números de página que se mostrarán en la paginación,
  // limitando el número de páginas a mostrar según la configuración de maxPaginasMostradas
  // tomado de contracargos component
  paginasArray(): number[] {
    const paginas = [];
    let inicio = Math.max(
      1,
      this.paginaActual - Math.floor(this.maxPaginasMostradas / 2)
    );
    const fin = Math.min(
      inicio + this.maxPaginasMostradas - 1,
      this.totalPaginas
    );

    if (this.totalPaginas - fin < Math.floor(this.maxPaginasMostradas / 2)) {
      inicio = Math.max(1, fin - this.maxPaginasMostradas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  ngOnInit(): void {
    this._paginationConfig = {...this.initialPaginationConfig}
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['initialPaginationConfig']) {
      return;
    }
    const previousValue = changes['initialPaginationConfig'].previousValue;
    if (!previousValue) {
      return;
    }
    
    const currentValue = changes['initialPaginationConfig'].currentValue;
    this.paginationConfig = currentValue;
  }

}
