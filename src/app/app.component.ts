import { Component, OnInit } from '@angular/core';
import { Usuario, getDefaultUsuario } from 'src/models/Usuario';
import { AppRouteKeys, UserRoles } from './constants';
import { LoginService } from './modules/analista/services/login.service';
import { VariablesGlobalesService } from './modules/comunes/variables-globales.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    //Inyectamos los servicios en el constructor.

    private loginService: LoginService,
    private dataStorageService: VariablesGlobalesService
  ) { }

  usuario: Usuario = getDefaultUsuario();
  usuarioIngresado: string = '';
  passwordIngresada: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';

  loadingLogin: boolean = false;
  usuarioLogueado: boolean = false;
  availablePaths: AppRouteKeys[] = [];

  roles = UserRoles;

  readonly analistaPaths = [AppRouteKeys.Contracargos, AppRouteKeys.Motivos];
  readonly ejecutivoPaths = [AppRouteKeys.Contracargos, AppRouteKeys.Motivos];
  readonly adminPaths = [
    AppRouteKeys.Contracargos,
    AppRouteKeys.MotivosAdmin,
    AppRouteKeys.Configuraciones,
    AppRouteKeys.Grupos,
  ];

  updateAvailablePaths() {
    let role = parseInt(this.usuario.rol_id + '');
    switch (role) {
      case UserRoles.Admin:
        this.availablePaths = this.adminPaths;
        break;
      case UserRoles.Analista:
        this.availablePaths = this.analistaPaths;
        break;
      case UserRoles.Ejecutivo:
        this.availablePaths = this.ejecutivoPaths;
        break;
      default:
        this.availablePaths = [];
        break;
    }
  }

  async iniciarSesion() {
    try {
      this.loadingLogin = true;
      // let resApiLogin = await this.loginService.loginFunction(
      //   this.usuarioIngresado,
      //   this.passwordIngresada
      // );

      // if (resApiLogin.status == 'OK') {
      if (true) {
        // this.usuario = {
        //   nombre: resApiLogin.auth.nombre,
        //   email: this.usuarioIngresado,
        //   id_token: resApiLogin.auth.id_token,
        //   usuario_id: parseInt(resApiLogin.auth.usuario_id + ''),
        //   rol_id: parseInt(resApiLogin.auth.rol_id + ''),
        //   refresh_token: resApiLogin.auth.refresh_token,
        //   expires_in: resApiLogin.auth.expires_in,
        //   user_name: resApiLogin.auth.user_name,
        // };

        // // Guardar en el localStorage
        // let respuestaSetStorage = this.dataStorageService.setUsuarioStorage(
        //   this.usuario
        // );

        // if (respuestaSetStorage.status) {
        if (true) {
          this.mensajeExito = '¡Login exitoso!';
          this.mensajeError = ''; // Limpiamos el mensaje de error en caso de que haya estado presente anteriormente.

          this.usuarioLogueado = true;
          this.updateAvailablePaths();
        } else {
          // en caso de que por X razon se hizo bien el login o sea ingreso bien los datos, pero no se pudo guardar en storage, no puede entrar pq toda la plataforma requiere el storage.
          this.mensajeError =
            'Hubo problemas para guardar los datos de inicio de sesion. Intente mas tarde.';
          this.mensajeExito = ''; // Limpiamos el mensaje de éxito en caso de que haya estado presente anteriormente.

          setTimeout(() => {
            this.mensajeError = '';
          }, 5000);
        }
      } else {
        // this.mensajeError = resApiLogin.message;
        this.mensajeExito = ''; // Limpiamos el mensaje de éxito en caso de que haya estado presente anteriormente.

        setTimeout(() => {
          this.mensajeError = '';
        }, 4000);
      }

      this.loadingLogin = false;
    } catch (error) {
      console.error('Error:', error);
      this.mensajeError = 'El servicio no esta funcionando, disculpa! :(';
      this.mensajeExito = ''; // Limpiamos el mensaje de éxito en caso de que haya estado presente anteriormente.
      this.loadingLogin = false;
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      // Verificar si hay un usuario en el localStorage al cargar el componente
      let { status, usuario } = this.dataStorageService.getUsuarioStorage();

      if (
        status &&
        usuario.rol_id &&
        !this.loginService.tokenExpired(usuario.id_token)
      ) {
        this.usuario = { ...usuario };
        this.usuarioLogueado = true;
        this.updateAvailablePaths();
      } else {
        this.dataStorageService.deleteUsuarioStorage();
      }
    } catch (error) {
      console.error('Error:', error);
      this.mensajeError =
        'Por alguna razon no se pudo obtener los datos del usuario logueado.';
      this.mensajeExito = ''; // Limpiamos el mensaje de éxito en caso de que haya estado presente anteriormente.
      this.loadingLogin = false;
    }
  }
}
