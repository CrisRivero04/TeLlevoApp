import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  
  constructor(private alertController: AlertController, private navCtrl: NavController) { }

  ngOnInit() {
  }

  //NgModel
  correo: string = "";
  correoValido: boolean = true;
  titulo: string = "Restablecer Contraseña";

  async recuperar(formulario: any) {
    if (formulario.valid && this.correoValido) {
      const alert = await this.alertController.create({
        header: 'Solicitud Enviada',
        message: 'Se ha enviado al correo la solicitud de cambio de contraseña.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              // Navegar a la página de login
              this.navCtrl.navigateRoot('/login');
            }
          }
        ]
      });
      await alert.present();
    } else {
      // Si el correo no es válido o no sigue el formato
      if (!this.correoValido) {
        console.log('El correo no sigue el formato correcto.');
      }
    }
  }

  validarCorreo(correo: string) {
    // Expresión regular para validar que el correo termine en @duocuc.cl
    const regex = /^[a-zA-Z0-9._%+-]+@duocuc\.cl$/;
    this.correoValido = regex.test(correo);
  }

}
