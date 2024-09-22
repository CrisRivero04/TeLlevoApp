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

  public updateUser(rut:string, newUser:any){
    const indice = this.usuarios.findIndex(usuario => usuario.rut == rut);
    if(indice == -1){
      return false;
    }
    this.usuarios[indice] = newUser;
    return true;
  }

  public obtenerUsuario(rut:string):any{
    return this.usuarios.find(usuario => usuario.rut == rut);
  }

  public obtenerUsuarios(): any[]{
    return this.usuarios;
  }
}
