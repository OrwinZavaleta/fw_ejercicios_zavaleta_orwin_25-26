import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Util } from '../../model/util';
import { WeeklyPlan } from '../../model/weekly-plan';
import { AuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';
import { UserMiniMeal } from '../../model/user-mini-meal';
import { NgOptimizedImage } from '@angular/common';
import { DayOfWeek } from '../../model/weekly-plan-day';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-plan-week-create',
  imports: [FormsModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './plan-week-create.html',
  styleUrl: './plan-week-create.css',
})
export class PlanWeekCreate {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private api = inject(ApiService);
  private storage = inject(StorageService)

  public formEnviadoFecha = signal<boolean>(false);
  public formEnviadoIngrediente = signal<boolean>(false);
  public fechaSeleccionada = signal<Date | null>(null);
  public platoSeleccionado = signal<UserMiniMeal | null>(null);

  public platosEncontrados = signal<UserMiniMeal[] | null>(null);

  public planSemanalGuardado: WeeklyPlan | null = null;
  public planSemanalBuffer = signal<(UserMiniMeal | null)[][]>([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ]);

  public fechaForm = this.fb.group({
    fecha: ['', [Validators.required]],
  });
  public ingredienteForm = this.fb.group({
    buscarIngrediente: ['', [Validators.required]],
  });

  public diasSemana: DayOfWeek[] = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo',
  ];
  public horasSemana: ('lunchMealId' | 'dinnerMealId')[] = ['lunchMealId', 'dinnerMealId'];

  handleFechaSeleccionada() {
    // TODO: comprobar que no haya otra fecha con esa semana
    // TODO: comprobar que la fecha sea superior a la actual
    this.formEnviadoFecha.set(true);
    if (this.fechaForm.invalid) {
      console.log('Form invalido');
      return;
    }

    const user = this.authService.currentUser()?.id;
    if (!user) {
      return;
    }

    const fechaFormSeleccionada = this.fechaForm.get('fecha')?.value;
    if (!fechaFormSeleccionada) {
      return;
    }

    this.fechaSeleccionada.set(new Date(fechaFormSeleccionada));

    this.planSemanalGuardado = {
      id: Util.getISOWeek(this.fechaSeleccionada() ?? new Date()),
      userId: user,
      days: this.diasSemana.map((dia) => {
        return { day: dia, [this.horasSemana[0]]: 0, [this.horasSemana[1]]: 0 };
      }),
    };
  }

  async handleBusquedaIngrediente() {
    this.formEnviadoIngrediente.set(true);
    if (this.ingredienteForm.invalid) {
      console.log('Form de ingredientes invalido');
      return;
    }

    const ingrediente = this.ingredienteForm.get('buscarIngrediente')?.value;
    if (!ingrediente) {
      return;
    }

    this.platosEncontrados.set(await this.api.pedirPlatosPorIngrediente(ingrediente));
  }

  handleIngredienteclick(plato: UserMiniMeal) {
    console.log(plato);

    this.platoSeleccionado.set(plato);
  }

  handleClickHorario(i: number, j: number) {
    console.log(i + ' ' + j);
    const diaSeleccionado =
      this.planSemanalGuardado?.days[
        this.planSemanalGuardado?.days.findIndex((d) => d.day === this.diasSemana[j])
      ];

    if (!diaSeleccionado) {
      return;
    }
    diaSeleccionado[this.horasSemana[i]] = this.platoSeleccionado()?.id;

    const planBuffer = this.planSemanalBuffer();
    planBuffer[i][j] = this.platoSeleccionado();

    console.log(this.planSemanalBuffer());

    console.log(this.planSemanalGuardado);
  }

  handleGuardarPlanSemanal() {
    // TODO: al menos una receta en al menos unos de los dias
    this.planSemanalGuardado
  }

  handleCancelarPlanSemanal() {}
}
