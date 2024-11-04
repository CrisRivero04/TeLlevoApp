import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})

export class DetalleReservaPage implements OnInit, AfterViewInit {
  id: number = 0;
  viaje: any = {};
  usuario: any;
  puedeTomarViaje: boolean = false;
  esConductor: boolean = false;
  viajeTerminado: boolean = false; 
  private map: L.Map | undefined;

  constructor(
    private activatedRouted: ActivatedRoute,
    private crudViajes: ViajeService,
    private crudUsuarios: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    private location: Location
  ) {}

  async ngOnInit() {
    this.id = +this.activatedRouted.snapshot.paramMap.get("id")!;
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
    this.esConductor = this.usuario.tiene_vehiculo == 'si';

    await this.obtenerViaje();
  }

  async obtenerViaje() {
    this.viaje = await this.crudViajes.getViaje(this.id);
  
    if (!this.viaje) {
      console.error('Viaje no encontrado');
      return;
    }
  
    this.viaje.usuariosNombres = this.viaje.usuariosNombres || [];
    console.log('Usuarios:', this.viaje.usuariosNombres);
    
    this.puedeTomarViaje = !this.esConductor && this.viaje.asientos_disp > 0 && !this.viaje.pasajeros.includes(this.usuario.rut);
    
    if (this.map) {
      this.map.remove();
    }

    this.initMap();
  }

  async tomarViaje() {
    const alertConfirm = await this.alertController.create({
      header: '¿Quieres tomar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          },
        },
        {
          text: 'Sí',
          handler: async () => {
            const exito = await this.crudViajes.tomarViaje(this.id, this.usuario.rut);
            if (exito) {
              const alertSuccess = await this.alertController.create({
                header: 'Viaje tomado con éxito',
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: async () => {
                      await this.router.navigate([`/detalle-reserva/${this.id}`]);
                      window.location.reload(); // Refresca la pantalla de detalle-reserva
                    },
                  },
                ],
              });
              await alertSuccess.present();
            }
          },
        },
      ],
    });
    await alertConfirm.present();
  }
  

  async salirDelViaje() {
    const alertConfirm = await this.alertController.create({
      header: '¿Quieres salir del viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          },
        },
        {
          text: 'Sí',
          handler: async () => {
            const exito = await this.crudViajes.salirViaje(this.id, this.usuario.rut);
            if (exito) {
              const alertSuccess = await this.alertController.create({
                header: 'Has salido del viaje con éxito',
                buttons: [
                  {
                    text: 'Aceptar',
                    handler: async () => {
                      await this.router.navigate([`/detalle-reserva/${this.id}`]);
                      window.location.reload();
                    },
                  },
                ],
              });
              await alertSuccess.present();
            }
          },
        },
      ],
    });
    await alertConfirm.present();
  }
  

  async actualizarEstado() {
    if (this.esConductor) {
      const exito = await this.crudViajes.cambiarEstadoViaje(this.id);
      if (exito) {
        this.viaje.estado = this.viaje.estado === 'Pendiente' ? 'En curso' : 'Terminado';
        this.viajeTerminado = this.viaje.estado === 'Terminado';
      }
    }
  }

  public reloadAndGoBack() {
    // Navega hacia la página anterior en el historial del navegador
    this.location.back();
  
    // Recarga la página actual
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
  

  ngAfterViewInit() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  initMap() {
    if (!this.map && this.viaje && this.viaje.latitud && this.viaje.longitud) {
      setTimeout(() => {
        this.map = L.map('map_html').setView([+this.viaje.latitud, +this.viaje.longitud], 13);
  
        // Tile layer para modo día (claro)
        const dayLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        });
  
        // Tile layer para modo noche (oscuro)
        const nightLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; CartoDB'
        });
  
        // Agrega el modo día por defecto
        dayLayer.addTo(this.map);
  
        // Configura el punto de origen y destino de la ruta
        const puntoOrigen = L.latLng(-33.59844040672239, -70.57881148451541);
        const puntoDestino = L.latLng(+this.viaje.latitud, +this.viaje.longitud);
  
        // Agrega el control de rutas con puntos dinámicos y personaliza el color de la línea
        L.Routing.control({
          waypoints: [puntoOrigen, puntoDestino],
          routeWhileDragging: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#800080', opacity: 0.8, weight: 6 }], // Color morado
            extendToWaypoints: true,
            missingRouteTolerance: 1
          }
        }).addTo(this.map);

        // Crear un control personalizado para el botón de minimización
      const ToggleButtonControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: () => {
          const button = L.DomUtil.create('button', 'toggle-button');
          button.innerHTML = 'Minimizar';
          button.onclick = () => {
            const container = document.querySelector('.leaflet-routing-container') as HTMLElement;
            if (container) {
              container.style.display = container.style.display === 'none' ? 'block' : 'none';
              button.innerHTML = container.style.display === 'none' ? 'Mostrar' : 'Minimizar';
            }
          };
          return button;
        }
      });

      // Agregar el botón al mapa
      this.map.addControl(new ToggleButtonControl());

        // Alternador de modo día/noche
        const baseMaps = {
          "Día": dayLayer,
          "Noche": nightLayer
        };
  
        // Control de capas para cambiar entre modos
        L.control.layers(baseMaps, undefined, { position: 'topleft' }).addTo(this.map);
      }, 0);
    }
  }
  
  
}
