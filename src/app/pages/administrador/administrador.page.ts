import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Storage } from '@ionic/storage-angular';  // Importar Storage

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit{

  persona: FormGroup;
  bienvenida: string = 'Bienvenido, por favor complete el formulario.';
  titulo: string = 'Registro de Usuario'; 
  usuarios: any[] = []; // Variable para almacenar la lista de usuarios
  editando: boolean = false;  // Indicador para saber si estamos editando
  rutUsuarioAEditar: string | null = null;  // Almacena el rut del usuario que se está editando

  ngOnInit() {
    
  }

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,  
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private router: Router,
    private storage: Storage  // Inyectar Storage
  ) {
    this.initStorage();  // Inicializar Storage

    // Inicialización del formulario
    this.persona = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\\.cl$')]],  
      numero_celular: ['', [Validators.required, Validators.pattern('^\\+569[0-9]{8}$')]], 
      rut: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10), this.validarRut.bind(this)]],  
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]], 
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      rep_contraseña: ['', Validators.required],
      fecha_nacimiento: ['', [Validators.required, this.validarEdadMinima]],
      tiene_vehiculo: ['', Validators.required],
      marca_vehiculo: [''],
      modelo_vehiculo: [''],
      cant_asientos: [''],
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
        this.persona.get('cant_asientos')?.setValidators([Validators.required, Validators.min(4), Validators.max(32), Validators.pattern('^[0-9]+$')]);
        this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern('^[A-Za-z]{2}[A-Za-z]{2}[0-9]{2}$')]);
        this.persona.get('anio_inscripcion')?.setValidators([Validators.required, Validators.min(2012), Validators.max(2024)]);
      } else {
        this.persona.get('marca_vehiculo')?.clearValidators();
        this.persona.get('modelo_vehiculo')?.clearValidators();
        this.persona.get('cant_asientos')?.clearValidators();
        this.persona.get('patente')?.clearValidators();
        this.persona.get('anio_inscripcion')?.clearValidators();
      }
      this.persona.get('marca_vehiculo')?.updateValueAndValidity();
      this.persona.get('modelo_vehiculo')?.updateValueAndValidity();
      this.persona.get('cant_asientos')?.updateValueAndValidity();
      this.persona.get('patente')?.updateValueAndValidity();
      this.persona.get('anio_inscripcion')?.updateValueAndValidity();
    });
  }

  // Inicializar Storage
  async initStorage() {
    await this.storage.create();  // Inicializar el storage
  }

  limpiarFormulario() {
    this.persona.reset();  // Esto reinicia el formulario
    this.editando = false; // Esto asegura que el botón vuelva a decir "Registrar"
  }
  // Cargar usuarios desde el almacenamiento
  async cargarUsuarios() {
    const storedUsers = await this.storage.get('usuarios');
    this.usuarios = storedUsers || [];  // Obtener la lista de usuarios o inicializar vacía
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
  async guardarCambios() {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD'); // Formato actualizado
    usuarioData.tipo = 'Alumno'; // Asignar tipo 'Usuario'

    const storedUsers = await this.storage.get('usuarios') || [];
    
    if (this.editando) {
      // Actualizar el usuario si estamos en modo edición
      const index = storedUsers.findIndex((user: any) => user.rut === this.rutUsuarioAEditar);
      if (index !== -1) {
        storedUsers[index] = usuarioData;
        await this.storage.set('usuarios', storedUsers); // Guardar los usuarios actualizados
        console.log("El usuario ha sido actualizado correctamente.");
      } else {
        console.log("Error al actualizar el usuario.");
      }
    } else {
      // Crear un nuevo usuario si no estamos editando
      const usuarioExistente = storedUsers.find((user: any) => user.rut === usuarioData.rut);
      if (!usuarioExistente) {
        storedUsers.push(usuarioData);
        await this.storage.set('usuarios', storedUsers); // Guardar el nuevo usuario
        console.log("El usuario ha sido creado correctamente.");
      } else {
        console.log("Error al crear el usuario. Usuario ya existe.");
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
  async eliminarUsuario(rut: string) {
    const storedUsers = await this.storage.get('usuarios') || [];
    const index = storedUsers.findIndex((user: any) => user.rut === rut);
    if (index !== -1) {
      storedUsers.splice(index, 1); // Eliminar el usuario
      await this.storage.set('usuarios', storedUsers); // Guardar la nueva lista
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

  public async registroUsuario(): Promise<void> {
    const usuarioData = { ...this.persona.value };
    usuarioData.fecha_nacimiento = moment(usuarioData.fecha_nacimiento).format('YYYY-MM-DD'); // Formato de fecha
    usuarioData.tipo = 'Alumno'; // Asignar tipo 'Usuario'
    
    const storedUsers = await this.storage.get('usuarios') || [];
    const usuarioExistente = storedUsers.find((user: any) => user.rut === usuarioData.rut);

    if (!usuarioExistente) {
      storedUsers.push(usuarioData);
      await this.storage.set('usuarios', storedUsers); // Guardar el nuevo usuario
      console.log("El Usuario se ha creado con éxito!");
      this.router.navigate(['/home']);
      this.cargarUsuarios(); // Actualiza la lista después del registro
    } else {
      console.log("Error! El Usuario ya existe!");
    }
  }

  // Método para calcular el dígito verificador del RUTÑ
  calcularDigitoVerificador(rut: string): string {
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
    if (!/^\d+$/.test(rutLimpio)) {
      throw new Error('RUT inválido');
    }
  
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = rutLimpio.length - 1; i >= 0; i--) {
      suma += parseInt(rutLimpio.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
  
    const resto = suma % 11;
    const digito = 11 - resto;
  
    if (digito === 10) {
      return 'K';
    } else if (digito === 11) {
      return '0';
    } else {
      return digito.toString();
    }
  }

  // Validar el RUT ingresado
  validarRut(control: AbstractControl): { [key: string]: boolean } | null {
    const rutCompleto = control.value;
    
    if (!rutCompleto || !/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto)) {
      return { rutInvalido: true };
    }

    const [rut, digito] = rutCompleto.split('-');
    const digitoVerificadorCalculado = this.calcularDigitoVerificador(rut);

    if (digito.toLowerCase() !== digitoVerificadorCalculado.toLowerCase()) {
      return { rutInvalido: true };
    }

    return null;
  }
}
