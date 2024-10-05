import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Registro de Usuario'; 

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,  
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private router: Router         
  ) {

    this.persona = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]],  
      numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]], 
      rut: ['',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]], 
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      rep_contraseña: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
      tiene_vehiculo: ['', Validators.required],
      marca_vehiculo: [''],
      modelo_vehiculo: [''],
      patente: [''],
      anio_inscripcion: ['']
    }, { validators: this.passwordsCoinciden });

    this.persona.get('tiene_vehiculo')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        this.persona.get('marca_vehiculo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('modelo_vehiculo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern('^[A-Za-z]{2}[A-Za-z]{2}[0-9]{2}$')]); // Patente formato chileno
        this.persona.get('anio_inscripcion')?.setValidators([Validators.required, Validators.min(2012), Validators.max(2024)]); // Año de inscripción entre 2012 y 2024
      } else { 
        this.persona.get('marca_vehiculo')?.clearValidators();
        this.persona.get('modelo_vehiculo')?.clearValidators();
        this.persona.get('patente')?.clearValidators();
        this.persona.get('anio_inscripcion')?.clearValidators();
      }
      this.persona.get('marca_vehiculo')?.updateValueAndValidity();
      this.persona.get('modelo_vehiculo')?.updateValueAndValidity();
      this.persona.get('patente')?.updateValueAndValidity();
      this.persona.get('anio_inscripcion')?.updateValueAndValidity();
    });
  }

  // Validar que las contraseñas coincidan
  passwordsCoinciden(formGroup: AbstractControl) {
    const contraseña = formGroup.get('contraseña')?.value;
    const repContraseña = formGroup.get('rep_contraseña')?.value;
    return contraseña === repContraseña ? null : { noCoinciden: true };
  }

  // Validar que la fecha de nacimiento sea de al menos 18 años
  validarEdadMinima(control: AbstractControl) {
    const fechaNacimiento = moment(control.value);
    const edad = moment().diff(fechaNacimiento, 'years');
    return edad >= 18 ? null : { menorDeEdad: true };
  }

  // Función para mostrar alerta y redirigir
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Cuenta creada',
      message: 'Se ha creado tu cuenta correctamente',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateRoot('/login'); 
        }
      }]
    });
    await alert.present();
  }

  public registroUsuario(): void {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD');
    usuarioData.tipo = 'Usuario'; 

    if (this.usuarioService.createUser(usuarioData)) {
      console.log("El Usuario se ha creado con éxito!");
      this.router.navigate(['/login']);
    } else {
      console.log("Error! El Usuario no se ha podido crear!");
    }
  }
}
