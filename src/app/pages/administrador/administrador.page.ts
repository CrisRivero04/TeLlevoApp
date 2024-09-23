import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage {

  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Registro de Usuario'; 
  usuarios: any[] = []; // Variable para almacenar la lista de usuarios
  editando: boolean = false;  // Indicador para saber si estamos editando
  rutUsuarioAEditar: string | null = null;  // Almacena el rut del usuario que se está editando

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,  
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private router: Router         
  ) {

    // Inicialización del formulario
    this.persona = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]],  
      numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]], 
      rut: ['',[Validators.minLength(9),Validators.maxLength(10),Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]], 
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      rep_contraseña: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
      tiene_vehiculo: ['', Validators.required],
      marca_vehiculo: [''],
      modelo_vehiculo: [''],
      patente: [''],
      anio_inscripcion: ['']
    }, { validators: this.passwordsCoinciden });

    // Cargar lista de usuarios
    this.cargarUsuarios();

    // Validación dinámica de los campos de vehículo
    this.persona.get('tiene_vehiculo')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        this.persona.get('marca_vehiculo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('modelo_vehiculo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z]+$')]);
        this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern('^[A-Za-z]{2}[A-Za-z]{2}[0-9]{2}$')]);
        this.persona.get('anio_inscripcion')?.setValidators([Validators.required, Validators.min(2012), Validators.max(2024)]);
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

  // Cargar usuarios desde el servicio
  cargarUsuarios() {
    this.usuarios = this.usuarioService.obtenerUsuarios(); // Obtener la lista de usuarios
  }

  // Función para mostrar el JSON en la consola
  mostrarUsuariosJson() {
    console.log(JSON.stringify(this.usuarios, null, 2));
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
          this.navCtrl.navigateRoot('/administrador'); 
        }
      }]
    });
    await alert.present();
  }

  // Función para registrar o modificar usuario
  guardarCambios() {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD'); // Formato actualizado
    usuarioData.tipo = 'Usuario'; // Asignar tipo 'Usuario'

    if (this.editando) {
      // Actualizar el usuario si estamos en modo edición
      if (this.usuarioService.updateUser(this.rutUsuarioAEditar!, usuarioData)) {
        console.log("El usuario ha sido actualizado correctamente.");
      } else {
        console.log("Error al actualizar el usuario.");
      }
    } else {
      // Crear un nuevo usuario si no estamos editando
      if (this.usuarioService.createUser(usuarioData)) {
        console.log("El usuario ha sido creado correctamente.");
      } else {
        console.log("Error al crear el usuario.");
      }
    }

    // Resetear el formulario y el estado de edición
    this.resetFormulario();
    this.cargarUsuarios();  // Recargar la lista de usuarios
  }

  // Prellenar el formulario con los datos del usuario a modificar
  modificarUsuario(usuario: any) {
    this.editando = true;  // Cambia a modo edición
    this.rutUsuarioAEditar = usuario.rut;  // Almacena el rut del usuario que se va a modificar

    // Prellenar el formulario
    this.persona.patchValue(usuario);
  }

  // Función para eliminar usuario
  eliminarUsuario(rut: string) {
    if (this.usuarioService.deleteUser(rut)) {
      console.log("El usuario ha sido eliminado correctamente.");
      this.cargarUsuarios(); // Recargar la lista de usuarios
    } else {
      console.log("Error al eliminar el usuario.");
    }
  }

  // Resetear el formulario y las variables de edición
  resetFormulario() {
    this.persona.reset();
    this.editando = false;
    this.rutUsuarioAEditar = null;
  }

  public registroUsuario(): void {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD'); // Formato de fecha
    usuarioData.tipo = 'Usuario'; // Asignar tipo 'Usuario'
    
    console.log(this.persona.value);  // Verifica los datos enviados al servicio
    if (this.usuarioService.createUser(usuarioData)) {
      console.log("El Usuario se ha creado con éxito!");
      this.router.navigate(['/home']);
      this.cargarUsuarios(); // Actualiza la lista después del registro
    } else {
      console.log("Error! El Usuario no se ha podido crear!");
    }
  }
}
