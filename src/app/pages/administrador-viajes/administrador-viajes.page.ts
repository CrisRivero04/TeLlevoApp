import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador-viajes',
  templateUrl: './administrador-viajes.page.html',
  styleUrls: ['./administrador-viajes.page.scss'],
})
export class AdministradorViajesPage implements OnInit {

  viajes: any[] = [];
  selectedViaje: any = null;  // Viaje seleccionado para edición

  constructor(private viajeService: ViajeService, private alertController: AlertController, private router: Router) { }

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
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Seguro que quieres modificar este viaje?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              // No se hace nada si el usuario selecciona "No"
            }
          },
          {
            text: 'Sí',
            handler: async () => {
              const success = await this.viajeService.updateViaje(this.selectedViaje.id, this.selectedViaje);
              if (success) {
                // Cargar la lista actualizada de viajes
                this.loadViajes();
                this.selectedViaje = null;
                this.router.navigate(['/home/administrador-viajes']);
                window.location.reload();
              } else {
                console.error('Error al actualizar el viaje');
              }
            }
          }
        ]
      });
  
      await alert.present();
    }
  }
  
  // Eliminar un viaje
  async deleteViaje(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Seguro que quieres eliminar el viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // No hace nada si se selecciona "No"
          }
        },
        {
          text: 'Sí',
          handler: async () => {
            const success = await this.viajeService.deleteUsuario(id);
            if (success) {
              // Cargar la lista actualizada de viajes
              this.loadViajes();
              // Redirigir a la página administrador-viajes
              this.router.navigate(['/home/administrador-viajes']);
              window.location.reload();
            } else {
              console.error('Error al eliminar el viaje');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  // Limpiar selección de viaje
  clearSelection() {
    this.selectedViaje = null;
  }
}
