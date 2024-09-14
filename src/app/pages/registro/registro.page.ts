import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  titulo: string = "Registro / TeLlevo App";
  bienvenida: string ="Bienvenido a TeLlevo App, porfavor, ingresa tus datos para crear tu cuenta!.";

  persona = new FormGroup({
    rut: new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    p_nombre: new FormControl('',[Validators.minLength(2),Validators.required,Validators.pattern("[a-z]{2,25}")]),
    s_nombre: new FormControl('',[Validators.minLength(2),Validators.pattern("[a-z]{2,25}")]),
    ap_paterno: new FormControl('',[Validators.minLength(2),Validators.required,Validators.pattern("[a-z]{2,25}")]),
    ap_materno: new FormControl('',[Validators.minLength(2),Validators.required,Validators.pattern("[a-z]{2,25}")]),
    contraseña: new FormControl('',[Validators.required]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
  });

  constructor(private router: Router) { }

  ngOnInit() {
  }

  registro() {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Iniciando sesión...');
    this.router.navigate(['/login']); // Navega a la página principal tras el login
  }

  public registrar():void{
    //validadciones? llamar a un posible CRUD
    //console.log(this.persona.value);
    //alert("Registrado!");
    //this.router.navigate(['/login']);
  }
}
