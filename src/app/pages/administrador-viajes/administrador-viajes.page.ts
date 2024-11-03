import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-administrador-viajes',
  templateUrl: './administrador-viajes.page.html',
  styleUrls: ['./administrador-viajes.page.scss'],
})
export class AdministradorViajesPage implements OnInit {

  viajes: any[] = [];
  selectedViaje: any = null;  // Viaje seleccionado para edición

  constructor(private viajeService: ViajeService) { }

searchQuery: string = '';
filteredViajes: any[] = [];

ngOnInit() {
  this.loadViajes();
}

async loadViajes() {
  this.viajes = await this.viajeService.getViajes();
  this.filteredViajes = this.viajes;  // Mostrar todos los viajes al inicio
}

buscarViaje() {
  this.filteredViajes = this.viajes.filter(viaje => 
    viaje.nombre_destino.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
}

  // Crear un nuevo viaje
  async createViaje() {
    const nuevoViaje = {
      asientos_disp: "4",
      nombre_destino: "Nuevo destino",
      latitud: "0",
      longitud: "0",
      metros: "0",
      tiempo_min: "0",
      estado: "Pendiente",
      monto: "0",
      hora_salida: "00:00",
      pasajeros: []
    };
    const rutConductor = '12345678-9';  // Ejemplo de conductor
    const success = await this.viajeService.createViaje(nuevoViaje, rutConductor);
    if (success) {
      this.loadViajes();
    } else {
      console.error('Error al crear el viaje');
    }
  }

  // Seleccionar un viaje para editar
  selectViaje(viaje: any) {
    this.selectedViaje = { ...viaje };
  }

  // Actualizar el viaje seleccionado
  async updateViaje() {
    if (this.selectedViaje && this.selectedViaje.id) {
      const success = await this.viajeService.updateViaje(this.selectedViaje.id, this.selectedViaje);
      if (success) {
        this.loadViajes();
        this.selectedViaje = null;
      } else {
        console.error('Error al actualizar el viaje');
      }
    }
  }

  // Eliminar un viaje
  async deleteViaje(id: number) {
    const success = await this.viajeService.deleteUsuario(id);
    if (success) {
      this.loadViajes();
    } else {
      console.error('Error al eliminar el viaje');
    }
  }

  // Limpiar selección de viaje
  clearSelection() {
    this.selectedViaje = null;
  }
}
