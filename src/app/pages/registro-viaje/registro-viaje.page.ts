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

    const normalTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    normalTileLayer.addTo(this.map);

    this.map.on('locationfound', (e) => {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
    });

    this.geocoder = G.geocoder({
        placeholder: "Ingrese dirección a buscar",
        errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    let routeControl: L.Routing.Control | undefined;  
    let closeButton: HTMLButtonElement | undefined;   
    
    this.geocoder.on('markgeocode', (e) => {
        let lat = e.geocode.properties['lat'];
        let lon = e.geocode.properties['lon'];

        this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
        this.viaje.controls.latitud.setValue(lat);
        this.viaje.controls.longitud.setValue(lon);

        if (this.map) {
            if (routeControl) {
                this.map.removeControl(routeControl);
                routeControl = undefined;
            }
            if (closeButton) {
                closeButton.remove();
                closeButton = undefined;
            }

            routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(-33.59844040672239, -70.57881148451541),
                    L.latLng(lat, lon)
                ],
                fitSelectedRoutes: true,
                lineOptions: {
                    styles: [{ color: '#800080', opacity: 0.8, weight: 6 }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 1
                }
            }).on('routesfound', (e) => {
                this.viaje.controls.metros.setValue(e.routes[0].summary.totalDistance);
                this.viaje.controls.tiempo_min.setValue(Math.round(e.routes[0].summary.totalTime / 60));
            }).addTo(this.map);

            closeButton = L.DomUtil.create('button', 'close-button') as HTMLButtonElement;
            closeButton.innerHTML = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.zIndex = '1000';
            closeButton.onclick = () => {
                if (routeControl) {
                    this.map?.removeControl(routeControl);
                    routeControl = undefined;
                }
                if (closeButton) {
                    closeButton.remove();
                    closeButton = undefined;
                }
                this.map?.setView([-33.59844040672239, -70.57881148451541], 16);
            };

            this.map.getContainer()?.appendChild(closeButton);
        }
    });

    // Crear el botón para alternar entre modos claro y oscuro
    const modeToggleButton = L.DomUtil.create('button', 'mode-toggle-button') as HTMLButtonElement;
    modeToggleButton.innerHTML = `<i class="icon"></i> Modo Claro`;
    modeToggleButton.style.position = 'absolute';
    modeToggleButton.style.top = '80px';
    modeToggleButton.style.left = '10px';
    modeToggleButton.style.zIndex = '1000';

    // Estilo del botón
    modeToggleButton.style.background = '#fff';
    modeToggleButton.style.border = 'none';
    modeToggleButton.style.padding = '5px 10px';
    modeToggleButton.style.cursor = 'pointer';
    modeToggleButton.style.borderRadius = '5px';
    modeToggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';

    modeToggleButton.onclick = () => {
        if (this.map) {
            if (this.map.hasLayer(normalTileLayer)) {
                this.map.removeLayer(normalTileLayer);
                this.map.addLayer(darkTileLayer);
                modeToggleButton.innerHTML = `<i class="icon"></i> Modo Claro`; // Cambia el texto a "Modo Claro"
            } else {
                this.map.removeLayer(darkTileLayer);
                this.map.addLayer(normalTileLayer);
                modeToggleButton.innerHTML = `<i class="icon"></i> Modo Oscuro`; // Cambia el texto a "Modo Oscuro"
            }
        }
    };

    this.map.getContainer()?.appendChild(modeToggleButton);
  }
 
}

