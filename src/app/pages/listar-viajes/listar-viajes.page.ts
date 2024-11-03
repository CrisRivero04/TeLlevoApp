import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-listar-viajes',
  templateUrl: './listar-viajes.page.html',
  styleUrls: ['./listar-viajes.page.scss'],
})
export class ListarViajesPage implements OnInit {

  usuario: any
  listaViajes: any[] = [];

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


  constructor(private crudViajes: ViajeService ) { }

  ngOnInit() {
    this.obtenerViajes();
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
  }

  async obtenerViajes() {
    const allViajes = await this.crudViajes.getViajes();
    this.listaViajes = allViajes
      .filter(viaje => viaje.estado == "Finalizado"); 
  }
}
