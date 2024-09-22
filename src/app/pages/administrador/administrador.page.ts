import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {
  usuarios: any[] = [];

  persona = new FormGroup({
    correo: new FormControl (['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]]),
    numero_celular: new FormControl (['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]]), 
    rut: new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]), 
    nombre: new FormControl (['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]]), 
    apellido: new FormControl (['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]]), 
    contraseña: new FormControl (['', [Validators.required, Validators.minLength(6)]]),
    rep_contraseña: new FormControl (['', Validators.required]),
    fecha_nacimiento: new FormControl (['', [Validators.required, this.validarEdadMinima]]),
    tiene_vehiculo: new FormControl (['', Validators.required]),
    marca_vehiculo: new FormControl (['']),
    modelo_vehiculo: new FormControl (['']),
    patente: new FormControl (['']),
    anio_inscripcion: new FormControl ([''])
  });


  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.obtenerUsuarios();
  }


  createUser(){
    if(this.usuarioService.createUser(this.persona.value)){
      alert("El usuaio se ha creado exitosamente")
      this.persona.reset()
    } else{
      alert("ERROR! no ha sido posible crear el usuario")
    }
  } 

  updateUser(){
    var buscar_rut: string = this.persona.controls.rut.value || "";
    if(this.usuarioService.updateUser(buscar_rut, this.persona.value)){
      alert("El usuario se ha actualizado con éxito!")
    } else{
      alert("ERROR! El usuario no se ha modificado")
    }
  }

  deleteUser(rut: string){
    if(this.usuarioService.deleteUser(rut)){
      alert("El usuario ha sido eliminado con éxito!")
    } else{
      alert("ERROR!, El usuario no ha sido eliminado")
    }
  }

  //Validaciones
  validarEdadMinima(control: AbstractControl) {
    const fechaNacimiento = moment(control.value);
    const edad = moment().diff(fechaNacimiento, 'years');
    return edad >= 18 ? null : { menorDeEdad: true };
  }

}
