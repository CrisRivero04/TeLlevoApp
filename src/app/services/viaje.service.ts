import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  private currentId = 4;
  private rutConductor = '';

  constructor(private storage: Storage, private crudUsuarios: UsuarioService) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const savedViajes = await this.storage.get('viajes');
      if (!savedViajes || savedViajes.length === 0) {
      let rutConductor = '12345678-9';

      let viaje = {
        asientos_disp: "4",
        nombre_destino: "Apostol Matias 2853, Puente Alto, Región Metropolitana",
        latitud: "-33.5843704050226",
        longitud: "-70.5699218595535",
        metros: "3600",
        tiempo_min: "9",
        estado: "Pendiente",
        monto: "2000",
        hora_salida:"20:00",
        pasajeros: []
      };
      
      await this.createViaje(viaje, rutConductor);
  
      await this.storage.set('viajes', [viaje]);
    }
  }
  

  // DAO
  public async createViaje(viaje: any, rutConductor: string): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    
    const conductor = await this.crudUsuarios.getUsuario(rutConductor);
    if (!conductor) {
        return false; 
    }
  
    viaje.conductor = conductor.nombre; 

    viaje.id = await this.generateAutoIncrementId(); 
    
    if (typeof viaje.id !== 'number' || isNaN(viaje.id)) {
        console.error("El ID generado no es un número:", viaje.id);
        return false;
    }

    viajes.push(viaje);

    await this.storage.set("viajes", viajes);
    return true;
  }


  public async getViaje(id: number): Promise<any> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let viaje = viajes.find(via => via.id == id);
    
    if (viaje) {
      viaje.pasajerosNombres = await Promise.all(
        viaje.pasajeros.map(async (rut: string) => {
          let usuario = await this.crudUsuarios.getUsuario(rut);
          return usuario ? usuario.nombre : 'Desconocido';
        })
      );
    } else {
      viaje = {
        pasajeros: [],
        pasajerosNombres: []
      };
    }
  
    return viaje; 
  }
  

  public async getViajes(): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id: number, nuevoViaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(via => via.id == id);
    if (indice == -1) {
      return false;
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async deleteUsuario(id: number): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(via => via.id == id);
    if (indice == -1) {
      return false;
    }
    viajes.splice(indice, 1);
    await this.storage.set("viajes", viajes);
    return true;
  }

  private async generateAutoIncrementId(): Promise<number> {
    const viajes: any[] = await this.storage.get("viajes") || [];
    const maxId = viajes.reduce((max, viaje) => Math.max(max, viaje.id ? Number(viaje.id) : 0), 0);
    this.currentId = maxId + 1;
    return this.currentId; 
}


  public async tomarViaje(id: number, rut: string): Promise<boolean> {
    let viaje = await this.getViaje(id);
    if (!viaje || viaje.asientos_disp <= 0 || viaje.pasajeros.includes(rut)) return false;

    viaje.pasajeros.push(rut);
    viaje.asientos_disp--;
    await this.updateViaje(id, viaje);
    return true;
  }

  public async salirViaje(id: number, rut: string): Promise<boolean> {
    let viaje = await this.getViaje(id);
  
    if (!viaje || !viaje.pasajeros.includes(rut)) return false;
  
    viaje.pasajeros = viaje.pasajeros.filter((pasajero: string) => pasajero !== rut);
    viaje.asientos_disp++;
      await this.updateViaje(id, viaje);
    return true;
  }
  

  public async cambiarEstadoViaje(id: number): Promise<boolean> {
    let viaje = await this.getViaje(id);
    if (!viaje) return false;

    switch (viaje.estado) {
        case "Pendiente":
            viaje.estado = "En Curso";
            break;
        case "En Curso":
            viaje.estado = "Finalizado";
            break;
        default:
            return false;
    }

    await this.updateViaje(id, viaje);
    return true;
  }

  public async esConductorDelViaje(id: number, rut: string): Promise<boolean> {
    const viaje = await this.getViaje(id);
    return viaje && viaje.conductor === rut; 
  }
  
  public async getHistorialViajes(rutUsuario: string): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.filter(viaje => 
      viaje.estado === "Finalizado" && 
      (viaje.conductor === rutUsuario || viaje.pasajeros.includes(rutUsuario))
    );
  }
  
}
