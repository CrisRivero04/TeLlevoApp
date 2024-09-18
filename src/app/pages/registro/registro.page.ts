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
    correo: new FormControl('',[Validators.required]),
    nombre: new FormControl('',[Validators.minLength(2),Validators.required,Validators.pattern("[a-z]{2,25}")]),
    apellido: new FormControl('',[Validators.minLength(2),Validators.required,Validators.pattern("[a-z]{2,25}")]),
    contraseña: new FormControl('',[Validators.required]),
    rep_contraseña: new FormControl('',[Validators.required]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    tiene_vehiculo: new FormControl('no',[Validators.required]),
    marca_vehiculo: new FormControl('',[Validators.required,Validators.pattern("[a-z][A-Z]")]),
    modelo_vehiculo: new FormControl('',[Validators.required,Validators.pattern("[a-z][A-Z]")]),
    patente: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("[a-z][A-Z][0-9]")]),
    anio_inscripcion: new FormControl('',[Validators.required,Validators.pattern("{1900, 2024}")])
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
