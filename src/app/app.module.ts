import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigComercioComponent } from './modules/admin/components/configuraciones/config-comercio/config-comercio.component';
import { ModalGestionConfigComponent } from './modules/admin/components/configuraciones/config-comercio/modal-gestion-config/modal-gestion-config.component';
import { ConfigMarcasComponent } from './modules/admin/components/configuraciones/config-marcas/config-marcas.component';
import { ConfigurationsComponent } from './modules/admin/components/configuraciones/configurations/configurations.component';
import { GruposComponent } from './modules/admin/components/grupos/grupos.component';
import { MenuConfigsComponent } from './modules/admin/components/monto-minimo/menu-configs/menu-configs.component';
import { MontoMinimoComponent } from './modules/admin/components/monto-minimo/monto-minimo/monto-minimo.component';
import { MotivosAdminComponent } from './modules/admin/components/motivos-admin/motivos-admin.component';
import { ContracargosComponent } from './modules/analista/components/contracargos/contracargos.component';
import { ListaDatosContracargoComponent } from './modules/analista/components/contracargos/lista-datos-contracargo/lista-datos-contracargo.component';
import { MotivosAnalistaComponent } from './modules/analista/components/motivos-analista/motivos-analista.component';
import { AlertaItemComponent } from './modules/comunes/alertas/alerta-item/alerta-item.component';
import { AlertasComponent } from './modules/comunes/alertas/alertas.component';
import { CustomToastComponent } from './modules/comunes/custom-toast/custom-toast.component';
import { SortIconDirective } from './modules/comunes/directives/sort-icon.directive';
import { BuscadorComponent } from './modules/comunes/filtros/buscador/buscador.component';
import { FiltrosCbkComponent } from './modules/comunes/filtros/filtros-cbk/filtros-cbk.component';
import { FiltrosMotivoComponent } from './modules/comunes/filtros/filtros-motivo/filtros-motivo.component';
import { IndicadoresComponent } from './modules/comunes/indicadores/indicadores.component';
import { ListaDesplegableComponent } from './modules/comunes/lista-desplegable/lista-desplegable.component';
import { ModalEnteraComponent } from './modules/comunes/modal-entera/modal-entera.component';
import { NavbarComponent } from './modules/comunes/navbar/navbar.component';
import { PaginationComponent } from './modules/comunes/pagination/pagination.component';
import { PdfIframeComponent } from './modules/comunes/visualizador/pdf-iframe/pdf-iframe.component';
import { VisualizadorEvidenciaComponent } from './modules/comunes/visualizador/visualizador-evidencia/visualizador-evidencia.component';
import { LoginComponent } from './modules/login/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContracargosComponent,
    MotivosAnalistaComponent,
    LoginComponent,
    ConfigurationsComponent,
    ConfigComercioComponent,
    ConfigMarcasComponent,
    IndicadoresComponent,
    ListaDesplegableComponent,
    GruposComponent,
    MontoMinimoComponent,
    MenuConfigsComponent,
    MotivosAdminComponent,
    FiltrosCbkComponent,
    BuscadorComponent,
    VisualizadorEvidenciaComponent,
    ModalEnteraComponent,
    PdfIframeComponent,
    CustomToastComponent,
    ModalGestionConfigComponent,
    FiltrosMotivoComponent,
    SortIconDirective,
    AlertasComponent,
    AlertaItemComponent,
    PaginationComponent,
    ListaDatosContracargoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    DatePipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
