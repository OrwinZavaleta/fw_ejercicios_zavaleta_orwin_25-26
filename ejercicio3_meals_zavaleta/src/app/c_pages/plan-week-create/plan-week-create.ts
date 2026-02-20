import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-plan-week-create',
  imports: [],
  templateUrl: './plan-week-create.html',
  styleUrl: './plan-week-create.css',
})
export class PlanWeekCreate {
  private fb = inject(FormBuilder);

  planSemanal = this.fb.group({});

  public diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  public horasSemana = ['comida', 'cena'];


}
