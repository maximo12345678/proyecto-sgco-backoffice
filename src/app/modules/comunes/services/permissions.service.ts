import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserRoles } from 'src/app/constants';
import { VariablesGlobalesService } from '../variables-globales.service';

interface RoleHomeUrlMap {
  [key: number]: string;
}

const DEFAULT_HOME_PATH = 'mcf-bts-contra-cargo/contracargos';

const homeUrls: RoleHomeUrlMap = {
  [UserRoles.Admin]: DEFAULT_HOME_PATH,
  [UserRoles.Analista]: DEFAULT_HOME_PATH,
  [UserRoles.Ejecutivo]: DEFAULT_HOME_PATH,
};

interface RouteRules {
  path: string;
  allowedRoles: number[];
}

const rules: RouteRules[] = [
  {
    path: '/mcf-bts-contra-cargo/contracargos',
    allowedRoles: [UserRoles.Admin, UserRoles.Analista, UserRoles.Ejecutivo],
  },
  {
    path: '/mcf-bts-contra-cargo/motivos',
    allowedRoles: [UserRoles.Analista, UserRoles.Ejecutivo],
  },
  {
    path: '/mcf-bts-contra-cargo/motivos-admin',
    allowedRoles: [UserRoles.Admin, UserRoles.Ejecutivo],
  },
  {
    path: '/mcf-bts-contra-cargo/grupos',
    allowedRoles: [UserRoles.Admin, UserRoles.Ejecutivo],
  },
  {
    path: '/mcf-bts-contra-cargo/configuraciones',
    allowedRoles: [UserRoles.Admin, UserRoles.Ejecutivo],
  },
  {
    path: '/mcf-bts-contra-cargo/configuracion-monto-minimo',
    allowedRoles: [UserRoles.Admin, UserRoles.Ejecutivo],
  },
];

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    private variablesGlobales: VariablesGlobalesService,
    private router: Router
  ) {}

  canActivate(url: string) {
    
    //
    if (url.length > 1 && url.substring(1) === DEFAULT_HOME_PATH) {
      return true;
    }
    let { status, usuario } = this.variablesGlobales.getUsuarioStorage();
    if (!status || !usuario) {
      
      this.router.navigate([DEFAULT_HOME_PATH]);
      return false;
    }

    
    const routeRule = rules.find((rule) => rule.path === url);
    if (!routeRule) return false;
    const canActivateRoute = routeRule.allowedRoles.includes(usuario.rol_id); 
    if (!canActivateRoute) {
      const homeUrl = homeUrls[usuario.rol_id];
      
      this.router.navigate([homeUrl]);
      return false;
    }
    return true;
  }
}

export const canActivatePath: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const permissionsService = inject(PermissionsService);
  const url = state.url.split('?')[0];
  return permissionsService.canActivate(url);
};
