import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  titulo: string = "Restablecer Contraseña";

  constructor(private router: Router) { }

  ngOnInit() {
  }

  //NgModel
  password: string = "";
  repetir_password: string = "";

  recuperar() {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Iniciando sesión...');
    this.router.navigate(['/login']); // Navega a la página principal tras el login
  }
}
