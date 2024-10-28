import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrar-viaje',
  templateUrl: './administrar-viaje.page.html',
  styleUrls: ['./administrar-viaje.page.scss'],
})
export class AdministrarViajePage implements OnInit {

  modoAdministracion: string = 'viajes';
  usuarios: any[] = [];
  viajes: any[] = [];

  // Definición de los datos del viaje como objeto
  viajeData = {
    id: null,
    conductor: '',
    asientos_disp: null,
    valor: null,
    nombre_destino: '',
    latitud: null,
    longitud: null,
    distancia_metros: null,
    tiempo_minutos: 0,
    estado_viaje: 'pendiente',
    pasajeros: []
  };

  constructor(
    private viajeService: ViajeService,
    private usuarioService: UsuarioService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.usuarios = await this.usuarioService.obtenerUsuarios();
    this.viajes = await this.viajeService.getViajes();
  }

  // Función para mostrar notificaciones en pantalla
  async mostrarNotificacion(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Notificación',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Crear un nuevo viaje
  async createViaje() {
    const success = await this.viajeService.createViaje(this.viajeData);
    if (success) {
      this.mostrarNotificacion('Viaje creado con éxito');
      this.limpiarFormulario();
      this.viajes = await this.viajeService.getViajes(); // Actualizar lista de viajes
    } else {
      this.mostrarNotificacion('Error: El ID del viaje ya existe');
    }
  }

  // Actualizar un viaje existente
  async updateViaje() {
    const id = String(this.viajeData.id); // Convertir `id` a `string`
    const success = await this.viajeService.updateViaje(id, this.viajeData);
    if (success) {
      this.mostrarNotificacion('Viaje actualizado con éxito');
      this.viajes = await this.viajeService.getViajes(); // Actualizar lista de viajes
    } else {
      this.mostrarNotificacion('Error al actualizar el viaje');
    }
  }

  // Eliminar un viaje por ID
  async deleteViaje(id: number) {
    const success = await this.viajeService.deleteViaje(id);
    if (success) {
      this.mostrarNotificacion('Viaje eliminado con éxito');
      this.viajes = await this.viajeService.getViajes(); // Actualizar lista de viajes
    } else {
      this.mostrarNotificacion('Error al eliminar el viaje');
    }
  }

  // Obtener un viaje para editarlo
  async getViaje(id: number) {
    const viaje = await this.viajeService.getViaje(String(id)); // Convertir `id` a `string`
    if (viaje) {
      this.viajeData = viaje;
    } else {
      this.mostrarNotificacion('Viaje no encontrado');
    }
  }

  // Limpiar el formulario de viajes
  limpiarFormulario() {
    this.viajeData = {
      id: null,
      conductor: '',
      asientos_disp: null,
      valor: null,
      nombre_destino: '',
      latitud: null,
      longitud: null,
      distancia_metros: null,
      tiempo_minutos: 0,
      estado_viaje: 'pendiente',
      pasajeros: []
    };
  }
}
