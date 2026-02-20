import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { StorageService } from '../../services/storage-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected loginForm: FormGroup;
  protected registerForm: FormGroup;

  public registered = signal<boolean>(false);
  public error = signal<string | null>(null);

  private authService = inject(AuthService);
  private storage = inject(StorageService);
  private router = inject(Router);

  public PASSWORD_LENGTH = 6;

  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(this.PASSWORD_LENGTH)]],
    });

    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(this.PASSWORD_LENGTH)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(this.PASSWORD_LENGTH)]],
      },
      { validators: this.validatePasswordCoindice },
    );
  }
  // ======================================
  // Devuelven un input de los formularios
  // ======================================
  loginInputs(campo: string) {
    return this.loginForm.get(campo);
  }

  registerInputs(campo: string) {
    return this.registerForm.get(campo);
  }

  // ======================================
  // Manejadores del envio de formulario
  // ======================================
  handleSubmitLogin() {
    if (!this.loginForm.valid) {
      this.mostrarAlerta('Error, formulario no valido.');
      return;
    }

    console.log(this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      this.mostrarAlerta('El usuario ya esta autenticado.');
      return;
    }

    const user = this.storage.buscarUsuarioPorCorreo(this.loginInputs('email')?.value);

    if (!user) {
      this.mostrarAlerta('No existe un usuario con ese email.');
      return;
    }

    if (user.password !== this.loginInputs('password')?.value) {
      this.mostrarAlerta('Correo o contraseñas no validas.');
      return;
    }

    const logged = this.authService.login(user);

    if (!logged) {
      this.mostrarAlerta('Error al logear al usuario.');
      return;
    }

    console.log('Se ha logeado');

    this.router.navigateByUrl('/');
  }

  handleSubmitRegister() {
    if (!this.registerForm.valid) {
      this.mostrarAlerta('Error, formulario no valido.');
      return;
    }

    console.log(this.authService.isAuthenticated());
    if (this.authService.isAuthenticated()) {
      this.mostrarAlerta('El usuario ya esta autenticado.');
      return;
    }

    const user = this.storage.buscarUsuarioPorCorreo(this.loginInputs('email')?.value);
    if (user) {
      this.mostrarAlerta('Ya existe un usuario con ese correo.');
      return;
    }

    const registeredS = this.authService.register({
      id: this.storage.obtenerProximoIdUser(),
      name: this.registerInputs('name')?.value,
      email: this.registerInputs('email')?.value,
      password: this.registerInputs('password')?.value,
    });

    if (!registeredS) {
      this.mostrarAlerta('Hubo un error al registrar al usuario.');
      return;
    }

    console.log('Se ha registrado');

    // this.router.navigateByUrl('/');

    this.registered.set(true);
  }

  // ======================================
  // Retornar si el campo es valido o no
  // ======================================
  esCampoValidoLoginClass(campo: string) {
    // if (
    //   this.loginInputs(campo)?.invalid &&
    //   (this.loginInputs(campo)?.touched || this.loginInputs(campo)?.dirty)
    // ) {
    //   return 'is-invalid';
    // } else {
    //   return '';
    // }
    return this.esCampoValidoLayout(campo, (c) => this.loginInputs(c));
  }
  esCampoValidoRegisterClass(campo: string) {
    return this.esCampoValidoLayout(campo, (c) => this.registerInputs(c));
  }

  private esCampoValidoLayout(
    campo: string,
    inputs: (campoInput: string) => AbstractControl | null,
  ) {
    // if (inputs(campo)?.invalid && (inputs(campo)?.touched || inputs(campo)?.dirty)) {
    //   return true;
    // } else {
    //   return false;
    // }
    return inputs(campo)?.invalid && (inputs(campo)?.touched || inputs(campo)?.dirty);
  }

  // ======================================
  // Validadores personalizados
  // ======================================
  private validatePasswordCoindice: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    // Debe tener el AbstractControl y el ValidationErrors y usarlos.
    const password = group.get('password');
    const passwordConfirm = group.get('passwordConfirm');

    if (password?.value === passwordConfirm?.value) {
      return null;
    }
    return { passwordMissmatch: true };
  };

  // ======================================
  // Validadores personalizados
  // ======================================
  private mostrarAlerta(mensaje: string) {
    this.error.set(mensaje);

    setTimeout(() => {
      this.error.set(null);
    }, 7000);
  }
}
