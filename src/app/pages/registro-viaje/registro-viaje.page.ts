import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-registro-viaje',
  templateUrl: './registro-viaje.page.html',
  styleUrls: ['./registro-viaje.page.scss'],
})

export class RegistroViajePage implements OnInit, AfterViewInit {

  usuario: any;
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;

  viaje = new FormGroup({
    conductor: new FormControl(),
    asientos_disp: new FormControl('',Validators.required),
    nombre_destino: new FormControl('',Validators.required),
    latitud: new FormControl('',Validators.required),
    longitud: new FormControl('',Validators.required),
    metros: new FormControl('',Validators.required),
    tiempo_min: new FormControl(),
    estado: new FormControl('pendiente'),
    monto: new FormControl('',Validators.required),
    hora_salida: new FormControl('',Validators.required),
    pasajeros: new FormControl([]),
  });

  constructor(private crudViajes: ViajeService, private router: Router, private navController: NavController) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
  }

  public async registrar() {
    console.log("Presionó registrar");
    
    // Verificar si el formulario es válido
    if (this.viaje.invalid) {
      console.error("Formulario inválido. Complete todos los campos obligatorios.");
      this.viaje.markAllAsTouched(); // Marca los campos para mostrar mensajes de error si hay algún input incompleto
      return;
    }
  
    const viajeData = this.viaje.value;
  
    const resultado = await this.crudViajes.createViaje(viajeData, this.usuario.rut);
    
    if (resultado) {
      this.router.navigate(["home/viajes"]);
    } else {
      console.error("Error al registrar el viaje. Asegúrese de que el conductor exista.");
    }
  }
  
  
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  
    this.map.on('locationfound', (e) => {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });
  
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);
  
    this.geocoder.on('markgeocode', (e) => {
      let lat = e.geocode.properties['lat'];
      let lon = e.geocode.properties['lon'];
  
      this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
      this.viaje.controls.latitud.setValue(lat);
      this.viaje.controls.longitud.setValue(lon);
  
      if (this.map) {
        L.Routing.control({
          waypoints: [
            L.latLng(-33.59844040672239, -70.57881148451541), // Cambia esto a las coordenadas que necesites
            L.latLng(lat, lon)
          ],
          fitSelectedRoutes: true,
        }).on('routesfound', (e) => {
          this.viaje.controls.metros.setValue(e.routes[0].summary.totalDistance);
          this.viaje.controls.tiempo_min.setValue(Math.round(e.routes[0].summary.totalTime / 60));
        }).addTo(this.map);
      }
    });
  
  }  
}

