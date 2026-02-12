import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { StorageService } from '../../services/storage-service';
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private storage = inject(StorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm: FormGroup;
  public registroExitoso = false;
  public submitted = false;
  public errorRegistro = '';

  public loginForm: FormGroup;
  public submittedLogin = false;
  public errorLogin = '';

  constructor() {
    this.registerForm = this.fb.group(
      {
        nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            this.emailDominioEduValidator,
            this.emailUnicoValidator.bind(this),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
      },
      { validators: this.passwordsCoinciden.bind(this) },
    );

    // TODO: hacer que salga no valido cuando la contraseña tampoco coincide.
    this.loginForm = this.fb.group({
      emailLogin: ['', [Validators.required, Validators.email, this.emailDominioEduValidator]],
      passwordLogin: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  //Usa this internamente y para que no pierda el contexto usamos bind
  //Otra solución es usar una función flecha
  public emailUnicoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const emailExiste = this.storage.existeUsuarioPorId(control.value);
    return emailExiste ? { emailDuplicado: true } : null;
  }

  //No usa this internamente, no necesitamos bind.
  //Se recomienda usar bind por si hubiera cambios: this.emailDominioEduValidator.bind(this)
  public emailDominioEduValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;
    const dominioValido = email.endsWith('@educastillalamancha.es');
    return dominioValido ? null : { dominioInvalido: true };
  }

  public passwordsCoinciden(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNoCoinciden: true };
  }

  public get nombreCompleto() {
    return this.registerForm.get('nombreCompleto');
  }
  public get email() {
    return this.registerForm.get('email');
  }
  public get password() {
    return this.registerForm.get('password');
  }
  public get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  public get emailLogin() {
    return this.loginForm.get('emailLogin');
  }
  public get passwordLogin() {
    return this.loginForm.get('passwordLogin');
  }
  public onRegister() {
    this.submitted = true;
    this.errorRegistro = '';

    if (this.registerForm.valid) {
      const nuevoUsuario: User = {
        id: this.storage.obtenerProximoIdUser(),
        name: this.registerForm.value.nombreCompleto,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      const success = this.authService.register(nuevoUsuario);

      if (success) {
        this.registroExitoso = true;
        this.registerForm.reset();
        this.submitted = false;
      } else {
        //alert('Error al registrar el usuario');
        this.errorRegistro = 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
      }
    }
  }
  public onLogin() {
    //Para limpiarlos para que no los considere como invalidos si no los ha tocado
    if (this.emailLogin?.hasError('authFail')) {
      this.emailLogin.setErrors(null);
    }
    if (this.passwordLogin?.hasError('authFail')) {
      this.passwordLogin.setErrors(null);
    }
    this.submittedLogin = true;
    if (this.loginForm.valid) {
      const user = this.storage.buscarUsuarioPorCorreo(this.loginForm.value.emailLogin);
      if (!user || (user && user.password !== this.loginForm.value.passwordLogin)) {
        this.errorLogin = 'El correo o la contraseña es incorrecta';
        this.passwordLogin?.setErrors({ authFail: true });
        this.emailLogin?.setErrors({ authFail: true });

        this.passwordLogin?.reset();
        console.error('Usuario no existe');
        return;
      }
      const success = this.authService.login(user);

      if (success) {
        this.loginForm.reset();
        this.submittedLogin = false;
        this.irAHome();
      }
    }
  }

  public irAHome() {
    this.registroExitoso = false;
    this.errorRegistro = '';
    this.router.navigate(['/']);
  }

  public getValidationClass(control: AbstractControl | null, isFormSubmitted: boolean): string {
    //NO mostrar validación hasta que el usuario envíe
    if (!isFormSubmitted) {
      return '';
    }
    //Mi los controles de forma individual.
    if (!control) {
      return '';
    }

    return control.valid ? 'is-valid' : 'is-invalid';
  }
  public getValidationClassConfirmPassword(): string {
    if (!this.submitted) {
      return '';
    }

    if (!this.confirmPassword) {
      return '';
    }

    // Primero verifico si el control tiene errores propios
    if (this.confirmPassword.errors) {
      return 'is-invalid';
    }

    // Luego verifico si el formulario tiene errores propios
    if (this.registerForm.errors?.['passwordsNoCoinciden']) {
      return 'is-invalid';
    }

    return 'is-valid';
  }
}
