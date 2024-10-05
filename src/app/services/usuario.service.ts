import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //aqui van las variables
  usuarios: any[] = [
    {
      tipo: 'Administrador',
      correo: 'admin@duocuc.cl',
      numero_celular: '+56912345678',
      rut: '12345678-9',
      nombre: 'alan',
      apellido: 'gajardo',
      contraseña: '12345678',
      rep_contraseña: '12345678',
      fecha_nacimiento: '1999-04-25',
      tiene_vehiculo: 'si',
      marca_vehiculo: 'renault',
      modelo_vehiculo: 'symbol',
      cant_asientos: '4',
      patente: 'GTDB20',
      anio_inscripcion: '2014'
    }
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

  public deleteUser(rut: string){
    const indice = this.usuarios.findIndex(usuario => usuario.rut == rut);
    if(indice == -1){
      return false;
    }
    this.usuarios.splice(indice, 1);
    return true;
  }

  public obtenerUsuario(rut:string):any{
    return this.usuarios.find(usuario => usuario.rut == rut);
  }

  public obtenerUsuarios(): any[]{
    return this.usuarios;
  }
}
