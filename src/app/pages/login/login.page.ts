import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  titulo: string = "Iniciar Sesión / TeLlevo App";
 
  constructor(private router: Router) { }

  login() {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Iniciando sesión...');
    this.router.navigate(['/home']); // Navega a la página principal tras el login
  }

  //NgModel
  email: string = "";
  password: string = "";
}


