import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  titulo: string = "Iniciar Sesión / TeLlevo App";
 
  constructor(private router: Router, 
    private usuarioService: UsuarioService, 
  ) { }

  ngOnInit() {
  }

  async login() {
    if(await this.usuarioService.login(this.email,this.password)){
      this.router.navigate(['/home']);
    }else{
      alert("CORREO O CONTRASEÑA INCORRECTOS!");
    }
  }

  //NgModel
  email: string = "";
  password: string = "";
}


