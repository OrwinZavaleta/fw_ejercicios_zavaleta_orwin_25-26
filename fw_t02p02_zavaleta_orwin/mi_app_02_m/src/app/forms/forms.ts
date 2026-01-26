import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-forms',
  standalone: false,
  templateUrl: './forms.html',
  styleUrl: './forms.css',
})
export class Forms {
  public titleComp = 'FORMS';
  public favoriteFramework = '';
  public module = {
    name: '',
    mark: '',
  };

  public profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email, this.emailEduValidator]),
  });

  public handleSubmit() {
    if (this.profileForm.valid) {
      alert(`Nombre: ${this.profileForm.value.name} (Email:
             ${this.profileForm.value.email})`);
    } else {
      alert('El formulario tiene errores.');
    }
  }
  public emailEduValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    return email && email.endsWith('@educastillalamancha.es') ? null : { emailEdu: true };
  }
}
