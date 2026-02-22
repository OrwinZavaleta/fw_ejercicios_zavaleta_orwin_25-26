import { Component, inject, signal } from '@angular/core';
import { StorageService } from '../../services/storage-service';
import { WeeklyPlan } from '../../model/weekly-plan';
import { DayOfWeek } from '../../model/weekly-plan-day';
import { UserMiniMeal } from '../../model/user-mini-meal';
import { MyMeal } from '../../model/my-meal';
import { ApiService } from '../../services/api-service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-plan-week-list',
  imports: [NgOptimizedImage],
  templateUrl: './plan-week-list.html',
  styleUrl: './plan-week-list.css',
})
export class PlanWeekList {
  private storage = inject(StorageService);
  private api = inject(ApiService);

  public planesSemanales: WeeklyPlan[];
  public planActual: WeeklyPlan | null = null;

  public loading = signal<boolean>(false);

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

  private templatePlanSemanalBuffer: (MyMeal | null)[][] = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ];

  public todosPlanesSemanales = signal<(typeof this.templatePlanSemanalBuffer)[]>([]);
  public planSemanalActual = signal<typeof this.templatePlanSemanalBuffer>([]);

  constructor() {
    this.loading.set(true);
    this.planesSemanales = this.storage
      .getPlanesSemanales()
      .sort((a, b) => b.id.localeCompare(a.id));
    this.cargarPlanesSemanales();
    this.cargarPlanActual();
  }

  async cargarPlanActual() {
    this.planActual = this.storage.getPlanSemanalActual() || null;

    const temp2: typeof this.templatePlanSemanalBuffer = structuredClone(
      this.templatePlanSemanalBuffer,
    );

    if (this.planActual) {
      for (let indexDia = 0; indexDia < this.planActual.days.length; indexDia++) {
        const dia = this.planActual.days[indexDia];

        if (dia.lunchMealId) {
          temp2[0][indexDia] = await this.api.pedirPlatoPorId(dia.lunchMealId);
        }
        if (dia.dinnerMealId) {
          temp2[1][indexDia] = await this.api.pedirPlatoPorId(dia.dinnerMealId);
        }
      }
      this.planSemanalActual.set(temp2);
    }
  }

  async cargarPlanesSemanales() {
    this.loading.set(true);
    const temp1: (typeof this.templatePlanSemanalBuffer)[] = [];
    for (let i = 0; i < this.planesSemanales.length; i++) {
      const e = this.planesSemanales[i];
      const temp2: typeof this.templatePlanSemanalBuffer = structuredClone(
        this.templatePlanSemanalBuffer,
      );

      for (let indexDia = 0; indexDia < e.days.length; indexDia++) {
        const dia = e.days[indexDia];

        if (dia.lunchMealId) {
          temp2[0][indexDia] = await this.api.pedirPlatoPorId(dia.lunchMealId);
        }
        if (dia.dinnerMealId) {
          temp2[1][indexDia] = await this.api.pedirPlatoPorId(dia.dinnerMealId);
        }
        // const plato = await this.api.pedirPlatoPorId(dia.lunchMealId as number);
        // this.todosPlanesSemanales.update((original) => {
        //   original[index][0][indexDia] = plato;
        //   return original;
        // });
      }

      temp1.push(temp2);
    }

    this.todosPlanesSemanales.set(temp1);
    console.log(this.todosPlanesSemanales());
    console.log(this.planesSemanales);
    this.loading.set(false);
  }

  handleEliminarPlan(id: WeeklyPlan['id']) {
    const confirmacion = confirm('Esta seguro que quiere eliminar el plan ' + id + '?');

    if (!confirmacion) return;

    this.storage.borrarPlanSemanalPorId(id);
    console.log('Eliminado');

    const aux1 = this.todosPlanesSemanales();

    aux1.splice(
      this.planesSemanales.findIndex((e) => e.id === id),
      1,
    );

    console.log(aux1);

    this.todosPlanesSemanales.set(aux1);
    this.planesSemanales = this.storage
      .getPlanesSemanales()
      .sort((a, b) => b.id.localeCompare(a.id));
  }
}
