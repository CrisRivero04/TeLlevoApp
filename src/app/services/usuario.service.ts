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

  public createUser(usuario:any){
    if(this.obtenerUsuario(usuario.rut) == undefined){
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }

  public obtenerUsuario(rut:string):any{
    return this.usuarios.find(usuario => usuario.rut == rut);
  }

  public obtenerUsuarios(): any[]{
    return this.usuarios;
  }
}
