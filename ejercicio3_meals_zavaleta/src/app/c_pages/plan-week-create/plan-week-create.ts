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
  private storage = inject(StorageService);

  public estadoGuardado = signal<{ tipo: string; mensaje: string } | null>(null);

  public formEnviadoFecha = signal<boolean>(false);
  public formEnviadoIngrediente = signal<boolean>(false);
  public fechaSeleccionada = signal<Date | null>(null);
  public platoSeleccionado = signal<UserMiniMeal | null>(null);

  public platosEncontrados = signal<UserMiniMeal[] | null>(null);

  public planSemanalGuardado: WeeklyPlan | null = null;
  private templatePlanSemanalBuffer: (UserMiniMeal | null)[][] = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ];
  public planSemanalBuffer = signal<(UserMiniMeal | null)[][]>(
    structuredClone(this.templatePlanSemanalBuffer),
  );

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
      this.mensajeEstadoGuardado('error', 'La seleccion de fecha es invalida.');
      return;
    }

    const user = this.authService.currentUser()?.id;
    if (!user) {
      this.mensajeEstadoGuardado('error', 'No hay un usuario registrado.');
      return;
    }

    const fechaFormSeleccionada = this.fechaForm.get('fecha')?.value;
    if (!fechaFormSeleccionada) {
      this.mensajeEstadoGuardado('error', 'No se ha seleccionado una fecha.');
      return;
    }

    this.fechaSeleccionada.set(new Date(fechaFormSeleccionada));

    this.planSemanalGuardado = {
      id: Util.getISOWeek(this.fechaSeleccionada() ?? new Date()),
      userId: user,
      days: this.diasSemana.map((dia) => {
        return { day: dia };
      }),
    };
  }

  async handleBusquedaIngrediente() {
    this.formEnviadoIngrediente.set(true);
    if (this.ingredienteForm.invalid) {
      console.log('Form de ingredientes invalido');
      this.mensajeEstadoGuardado('error', 'La busqueda de ingredientes es invalida.');
      return;
    }

    const ingrediente = this.ingredienteForm.get('buscarIngrediente')?.value;
    if (!ingrediente) {
      this.mensajeEstadoGuardado('error', 'No se ha seleccionado un ingrediente.');
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
      this.mensajeEstadoGuardado('error', 'No se ha seleccionado un dia.');
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

    if (!this.planSemanalGuardado) {
      return;
    }
    this.storage.guardarPlanSemanal(this.planSemanalGuardado);
    this.mensajeEstadoGuardado('success', 'Se guardo correctamente el plan semanal');
    this.handleCancelarPlanSemanal();
  }

  handleCancelarPlanSemanal() {
    console.log(this.planSemanalBuffer());
    console.log('=============');

    this.planSemanalBuffer.set(structuredClone(this.templatePlanSemanalBuffer));
    console.log(this.planSemanalBuffer());
    this.formEnviadoFecha.set(false);
    this.formEnviadoIngrediente.set(false);
    this.fechaForm.reset();
    this.ingredienteForm.reset();

    this.fechaSeleccionada.set(null);
    this.platoSeleccionado.set(null);
    this.platosEncontrados.set(null);
    this.planSemanalGuardado = null;
  }

  mensajeEstadoGuardado(tipo: string, mensaje: string) {
    this.estadoGuardado.set({ tipo: tipo, mensaje: mensaje });

    setTimeout(() => {
      this.estadoGuardado.set(null);
    }, 5000);
  }
}
