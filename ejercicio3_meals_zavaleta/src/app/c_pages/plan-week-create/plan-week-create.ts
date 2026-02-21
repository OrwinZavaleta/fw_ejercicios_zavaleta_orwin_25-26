import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plan-week-create',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './plan-week-create.html',
  styleUrl: './plan-week-create.css',
})
export class PlanWeekCreate {
  private fb = inject(FormBuilder);
  // public fechaSeleccionada = signal<Date | null>(null);

  public fechaForm = this.fb.group({
    fecha: ['', [Validators.required]],
  });

  public diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  public horasSemana = ['comida', 'cena'];

  handleFechaSeleccionada(fechaSeleccionada: string) {
    if (this.fechaForm.invalid){
      console.log("Form invalido");

      return
    }
    console.log('Tengo la fecha ' + fechaSeleccionada);
  }
}
