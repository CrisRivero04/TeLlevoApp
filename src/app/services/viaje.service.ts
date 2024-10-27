import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { elementAt } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private _storage: Storage | null = null;
  viajes: any[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init(){
    await this.storage.create();
  }

  public async createViaje(viaje: any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    if(viajes.find(v => v.id==viaje.id)!=undefined){
      return false;
    }
    viajes.push(viaje);
    await this.storage.set("viajes",viajes);
    return true;
  }

  // Actualizar un viaje y guardar en el almacenamiento
  public async updateViaje(id: string, pasajero: any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id==id);
    if(indice==-1){
      return false;
    }
    if(viajes[indice].pasajeros.find((pasajero: any) => pasajero.rut == pasajero.rut)){
      return false;
    }
    viajes[indice].pasajeros.push(pasajero);
    viajes[indice].asientos_disp = viajes[indice].asientos_disp - 1;
    await this.storage.set("viajes",viajes);
    return true;
  } 

  // Eliminar un viaje y actualizar el almacenamiento
  public async deleteViaje(id: number): Promise<boolean> {
    const indice = this.viajes.findIndex(via => via.id === id);
    if (indice === -1) {
      return false;
    }
    this.viajes.splice(indice, 1);
    await this._storage?.set('viajes', this.viajes);
    return true;
  }

  // Obtener un viaje por rut
  public obtenerViaje(id: number): any {
    return this.viajes.find(via => via.id === id);
  }

  // Obtener todos los viajes
  public async obtenerViajes(): Promise<any[]> {
    return await this.storage.get('viajes');
  }

  public async getViaje(id: string): Promise<any>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(v => v.id==id);
  }
  
  public async getViajes(): Promise<any[]>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

}
