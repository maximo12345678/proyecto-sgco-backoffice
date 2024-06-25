import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationsComponent } from './modules/admin/components/configuraciones/configurations/configurations.component';
import { GruposComponent } from './modules/admin/components/grupos/grupos.component';
import { MenuConfigsComponent } from './modules/admin/components/monto-minimo/menu-configs/menu-configs.component';
import { MotivosAdminComponent } from './modules/admin/components/motivos-admin/motivos-admin.component';
import { ContracargosComponent } from './modules/analista/components/contracargos/contracargos.component';
import { MotivosAnalistaComponent } from './modules/analista/components/motivos-analista/motivos-analista.component';
import { canActivatePath } from './modules/comunes/services/permissions.service';


// NOTA: LOS PERMISOS DE CADA RUTA SE DEFINEN DONDE ESTA LA FUNCION canActivatePath
const routes: Routes = [
  { path: 'mcf-bts-contra-cargo/contracargos', component: ContracargosComponent, canActivate:[canActivatePath] },
  { path: 'mcf-bts-contra-cargo/motivos', component: MotivosAnalistaComponent, canActivate:[canActivatePath] },

  { path: 'mcf-bts-contra-cargo/motivos-admin', component: MotivosAdminComponent, canActivate:[canActivatePath]},
  { path: 'mcf-bts-contra-cargo/configuraciones', component: ConfigurationsComponent, canActivate:[canActivatePath]},
  { path: 'mcf-bts-contra-cargo/grupos', component: GruposComponent, canActivate:[canActivatePath]},
  { path: 'mcf-bts-contra-cargo/configuracion-monto-minimo', component: MenuConfigsComponent, canActivate:[canActivatePath] },

  // { path: 'mcf-bts-contra-cargo/login', component: LoginComponent },
  
  { path: '', redirectTo: '/mcf-bts-contra-cargo/contracargos', pathMatch: 'full' }, // Redirige la barra sola (/) a /sistema/motivos
  { path: '**', redirectTo: 'mcf-bts-contra-cargo/contracargos', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
