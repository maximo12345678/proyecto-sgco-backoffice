import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRouteKeys, BASE_PATH, UserRoles } from 'src/app/constants';
import { ManageNotificationEvent } from 'src/app/modules/comunes/alertas/AlertaItem';
import { VariablesGlobalesService } from 'src/app/modules/comunes/variables-globales.service';
import { Usuario, getDefaultUsuario } from 'src/models/Usuario';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  @Input() usuario: Usuario = getDefaultUsuario();
  @Input() inputPathKeys!: AppRouteKeys[];

  RouteKeys = AppRouteKeys;
  BasePath = BASE_PATH;

  // Boton para activar menu en version responsive
  botonActiveMenu: boolean = false;

  // Boton de filtro ESTADO seleccionado
  botonMenuSeleccionado: number = 1;

  inputKeysIncludes(key: AppRouteKeys): boolean {
    return this.inputPathKeys.includes(key);
  }

  isSelected(key: AppRouteKeys): boolean {
    return this.pathsMap[key] === this.botonMenuSeleccionado;
  }

  get userRoleName(): string {
    let roleValue = this.usuario.rol_id;
    return (
      Object.entries(UserRoles).find(
        ([key, value]) => value === roleValue
      )?.[0] ?? ''
    );
  }

  getRouteStr(routeKey: AppRouteKeys) {
    return `${BASE_PATH}/${routeKey}`;
  }

  readonly pathsMap: { [key: string]: number } = {
    [AppRouteKeys.Contracargos]: 1,
    [AppRouteKeys.Motivos]: 2,
    [AppRouteKeys.MotivosAdmin]: 3,
    [AppRouteKeys.Configuraciones]: 4,
    [AppRouteKeys.Grupos]: 5,
  };

  constructor(
    private dataStorageService: VariablesGlobalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let finalPath: string = location.pathname.split('/').at(-1) ?? '';
    let currentPathIndex = this.pathsMap[finalPath] ?? 1;
    this.botonMenuSeleccionado = currentPathIndex;
  }

  cambiarBotonActiveMenu(): void {
    this.botonActiveMenu = !this.botonActiveMenu;
  }

  seleccionarBotonMenu(numero: number): void {
    this.botonMenuSeleccionado = numero;
    this.botonActiveMenu = false;
  }

  navegarPorAlertaClickeada(event: ManageNotificationEvent) {
    let targetPath = event.path.split('/').at(-1) ?? '';
    let pathIdx = this.pathsMap[targetPath] ?? 1;
    this.seleccionarBotonMenu(pathIdx);
    if (event.args) {
      this.router.navigate([event.path], {
        queryParams: { ...event.args },
      });
    } else {
      this.router.navigate([event.path]);
    }
  }

  async cerrarSesion() {
    try {
      // Verificar si hay un usuario en el localStorage al cargar el componente
      let respuestaDeletetStorage =
        this.dataStorageService.deleteUsuarioStorage();

      if (respuestaDeletetStorage.status) {
        location.reload();
      }
    } catch (error) {
      let msj = 'Por alguna razon no se puede cerrar sesion!';
      console.error(msj + ': ' + error);
    }
  }
}
