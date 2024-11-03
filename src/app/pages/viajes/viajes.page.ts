import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  usuario: any;
  
  viaje = new FormGroup({
    conductor: new FormControl(),
    asientos_disp: new FormControl(),
    nombre_destino: new FormControl(),
    latitud: new FormControl(),
    longitud: new FormControl(),
    metros: new FormControl(),
    tiempo_min: new FormControl(),
    estado: new FormControl('pendiente'),
    monto: new FormControl(),
    hora_salida: new FormControl(),
    pasajeros: new FormControl([]),
  });

  viajes: any[] = [];
  
  constructor(private crudViajes: ViajeService , private router: Router) { }

  ngOnInit() {
    this.obtenerViajes();
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  async obtenerViajes() {
    const allViajes = await this.crudViajes.getViajes();
    this.viajes = allViajes
      .filter(viaje => viaje.asientos_disp > 0 && viaje.estado !== "Finalizado"); 
  }
  
}
