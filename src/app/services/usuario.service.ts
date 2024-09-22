import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //aqui van las variables
  usuarios: any[] = [

    
  ];

  constructor() { }

  //aqui va la lógica(crud)

  public obtenerUsuario(rut:string):any{
    return this.usuarios.find(usuario => usuario.rut == rut);
  }

  public obtenerUsuarios(): any[]{
    return this.usuarios;
  }
}
