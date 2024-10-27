import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

//lo primero es agregar un import:
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  //variables del grupo:
  viaje = new FormGroup({
    id: new FormControl('',[]),
    conductor: new FormControl('',[Validators.required]),
    asientos_disp: new FormControl('',[Validators.required]),
    valor: new FormControl('',[Validators.required]),
    nombre_destino: new FormControl('',[Validators.required]),
    latitud: new FormControl('',[Validators.required]),
    longitud: new FormControl('',[Validators.required]),
    distancia_metros: new FormControl('',[Validators.required]),
    tiempo_minutos: new FormControl(0,[Validators.required]),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  //vamos a crear variable(s) para controlar el mapa:
  usuario: any;
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  latitud: number = 0;
  longitud: number = 0;
  direccion: string = "";
  distancia_metros: number = 0;
  tiempo_segundos: number = 0;

  //Simulacion de una lista de viajes ya creados: Eventualmente le Cargan datos a la lista
  viajes: any[] = [{
    "id": 1,
    "conductor": "Lalo Cura",
    "asientos_disponibles": 4,
    "nombre_destino": "Santa Isabel Sur",
    "latitud": -33.59,
    "longitud": -70.53,
    "distancia_metros": 5000,
    "tiempo_segundos": 900,
    "estado_viaje": "pendiente",
    "pasajeros": []
    },{
      "id": 2,
      "conductor": "Elba Lazo",
      "asientos_disponibles": 1,
      "nombre_destino": "Santa Isabel Sur",
      "latitud": -33.59,
      "longitud": -70.53,
      "distancia_metros": 5000,
      "tiempo_segundos": 900,
      "estado_viaje": "pendiente",
      "pasajeros": [17888444, 15999555]
    },{
      "id": 3,
      "conductor": "Elvis Teck",
      "asientos_disponibles": 0,
      "nombre_destino": "Santa Isabel Sur",
      "latitud": -33.59,
      "longitud": -70.53,
      "distancia_metros": 5000,
      "tiempo_segundos": 900,
      "estado_viaje": "termindo",
      "pasajeros": [14888555]
    },{
      "id": 4,
      "conductor": "Armando Casas",
      "asientos_disponibles": 0,
      "nombre_destino": "Santa Isabel Sur",
      "latitud": -33.59,
      "longitud": -70.53,
      "distancia_metros": 5000,
      "tiempo_segundos": 900,
      "estado_viaje": "pendiente",
      "pasajeros": [17888999,15444888,16555444,15888888]
    }
  ];

  constructor(private viajeService: ViajeService) { }

  async ngOnInit() {
    this.initMap();
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
    await this.rescatarViajes();
  }

  async crearViaje(){
    if(await this.viajeService.createViaje(this.viaje.value)){
      alert("VIAJE CREADO!");
      this.viaje.reset();
      await this.rescatarViajes();
    }
  }


  //aqui rescatamos el viaje:
  async rescatarViajes(){
    this.viajes = await this.viajeService.getViajes();
  }

  initMap() {
    // Verificar si el mapa ya está inicializado y destruirlo si es necesario
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  
    // Inicializar el mapa en el contenedor con id "map_html" con una vista predeterminada
    this.map = L.map("map_html").setView([-33.59837122676798, -70.57877634597855], 16);
  
    // Configurar la capa de mosaico para el mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  
    // Agregar el evento para la ubicación del usuario
    this.map.on('locationfound', (e) => {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });
  
    // Activar el seguimiento de ubicación del usuario cuando el mapa esté listo
    this.map.locate({ setView: true, maxZoom: 16 });
  
    // Agregar el buscador de direcciones al mapa
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);
  
    // Configurar la acción que ocurre cuando se encuentra una dirección
    this.geocoder.on('markgeocode', (e) => {
      this.latitud = e.geocode.properties['lat'];
      this.longitud = e.geocode.properties['lon'];
      this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
  
      // Añadir un círculo para indicar el radio de la búsqueda
      var circulo = L.circle([this.latitud, this.longitud], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
      }).addTo(this.map!);
  
      // Agregar la ruta desde el origen hasta el destino seleccionado
      if (this.map) {
        L.Routing.control({
          waypoints: [
            L.latLng(-33.59837122676798, -70.57877634597855),
            L.latLng(this.latitud, this.longitud)
          ],
          fitSelectedRoutes: true,
        }).on('routesfound', (e) => {
          this.viaje.controls.distancia_metros.setValue(e.routes[0].summary.totalDistance);
          this.viaje.controls.tiempo_minutos.setValue(Math.round(e.routes[0].summary.totalTime / 60));
        }).addTo(this.map);
      }
    });
  }
  

}
