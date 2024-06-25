import { Injectable } from '@angular/core';
import { Usuario, getDefaultUsuario } from 'src/models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobalesService {
  //vamos a usar el componente para interactuar con el local storage y reutilizar las llamadas desde cualquier componente

  private usuario: Usuario = getDefaultUsuario();

  // Método para establecer el ID Token y el ID Usuario después de un inicio de sesión exitoso
  setUsuarioStorage(usuarioParametro: Usuario) {
    let respuesta: { status: boolean; usuario: Usuario } = {
      status: false,
      usuario: getDefaultUsuario(),
    };

    this.usuario = { ...usuarioParametro };

    try {
      localStorage.setItem('usuario', JSON.stringify(this.usuario));
      respuesta.status = true;
      respuesta.usuario = this.usuario;
    } catch (error) {
      console.error('Error al cargar datos en storage:', error);
    }

    return respuesta;
  }

  // Método para obtener el ID Token
  getUsuarioStorage() {
    let respuesta: { status: boolean; usuario: Usuario } = {
      status: false,
      usuario: getDefaultUsuario(),
    };

    try {
      const usuarioEnLocalStorage = localStorage.getItem('usuario');

      if (usuarioEnLocalStorage) {
        respuesta.status = true;
        // sin esta funcion los campos numericos se guardan como string...
        let lsUser: Usuario = JSON.parse(
          usuarioEnLocalStorage,
          function (k, v) {
            return typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10);
          }
        );
        respuesta.usuario = lsUser;
      }
    } catch (error) {
      console.error('Error al traer datos en storage: ', error);
    }

    return respuesta;
  }

  deleteUsuarioStorage() {
    let respuesta: { status: boolean; usuario: Usuario } = {
      status: false,
      usuario: getDefaultUsuario(),
    };

    try {
      const usuarioEnLocalStorage = localStorage.getItem('usuario');

      if (usuarioEnLocalStorage) {
        localStorage.removeItem('usuario');
        respuesta.status = true;
        respuesta.usuario = getDefaultUsuario();
      }
    } catch (error) {
      console.error('Error al eliminar datos en storage: ', error);
    }

    return respuesta;
  }
}
