import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  usuarios: any[] = [];


  constructor(private storage: Storage) {
    
    this.init();
   }

  async init(){
    await this.storage.create();
    
    let usuarioPredeterminado  = {
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
    };
    await this.createUsuario(usuarioPredeterminado );
  }

  public async createUsuario(usuario: any): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if (usuarios.find(usu=>usu.rut==usuario.rut)!=undefined) {
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  public async getUsuario(rut: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu => usu.rut==rut);
  }

  public async getUsuarios(): Promise<any[]> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios;
  }

  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if (indice === -1) {
      return false;
    }
    usuarios[indice] = nuevoUsuario;
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async deleteUsuario(rut: string): Promise <boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if (indice === -1) {
      return false;
    }
    usuarios.splice(indice,1);
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async login (email: string, contra: string): Promise <boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usu = usuarios.find(usu => usu.correo == email  && usu.contraseña == contra);
    if(usu){
      localStorage.setItem("usuario",JSON.stringify(usu));
      return true;
    }
    return false;
  }

  public async recuperarUsuario (email: string): Promise <any> {
    let personas: any[] = await this.storage.get("personas") || [];
    return personas.find(element => element.email == email);
  }
}
