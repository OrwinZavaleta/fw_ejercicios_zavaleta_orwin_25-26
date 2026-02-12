import { inject, Injectable } from '@angular/core';

import { InterfaceHouseForm } from '../interfaces/interface-house-form';
import { WeekDay } from '../enums/week-day';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
//Trabajamos con las citas en memoria hasta guardar.
export class ApplyService {
  private localStorageService = inject(LocalStorageService);

  private working: InterfaceHouseForm[] = [];

  private dirty = false; //Cambios pendientes
  constructor() {
    this.initializeTestData();
  }

  load(): void {
    this.working = this.localStorageService.getAllApplications();
    this.dirty = false;
  }

  getAppointments(): InterfaceHouseForm[] {
    return this.working;
  }

  hasPendingChanges(): boolean {
    return this.dirty;
  }

  saveChanges(): void {
    this.localStorageService.setAllApplications(this.working);
    this.dirty = false;
  }

  discardChanges(): void {
    this.load();
  }

  addAppointment(app: InterfaceHouseForm): void {
    //crear una COPIA del objeto, no guardar la referencia
    this.working.push({ ...app });
    this.dirty = true;
  }

  deleteAppointmentById(id: number): boolean {
    const index = this.working.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }

    this.working.splice(index, 1);
    this.dirty = true;
    return true;
  }

  assignDay(id: number, day: WeekDay): boolean {
    const appointment = this.working.find((a) => a.id === id);
    if (!appointment) return false;

    const appointmentsThatDay = this.working.filter((a) => a.assignedDay === day && a.id !== id);

    if (appointmentsThatDay.length >= 2) {
      return false;
    }

    appointment.assignedDay = day;
    this.dirty = true;
    return true;
  }

  getAppointmentsByDay(day: WeekDay): InterfaceHouseForm[] {
    return this.working.filter((a) => a.assignedDay === day);
  }
  getUnassignedAppointments(): InterfaceHouseForm[] {
    return this.working.filter((a) => !a.assignedDay);
  }

  clear(): void {
    this.working = [];
    this.dirty = false;
  }

  private initializeTestData(): void {
    // Si ya hay datos, no hacemos nada
    const existing = this.localStorageService.getAllApplications();
    if (existing.length > 0) {
      return;
    }

    const baseDate = new Date(2026, 2, 6);

    const testApplications: InterfaceHouseForm[] = [
      {
        id: 1,
        firstName: 'Gon',
        lastName: 'Freecss',
        email: 'gon@hunter.com',
        housingLocationId: 1,
        consultaDate: baseDate,
        assignedDay: WeekDay.Monday,
      },
      {
        id: 2,
        firstName: 'Killua',
        lastName: 'Zoldyck',
        email: 'killua@hunter.com',
        housingLocationId: 1,
        consultaDate: baseDate,
        assignedDay: WeekDay.Monday,
      },
      {
        id: 3,
        firstName: 'Kurapika',
        lastName: 'Kurta',
        email: 'kurapika@hunter.com',
        housingLocationId: 2,
        consultaDate: baseDate,
        assignedDay: WeekDay.Friday,
      },
      {
        id: 4,
        firstName: 'Leorio',
        lastName: 'Paradinight',
        email: 'leorio@hunter.com',
        housingLocationId: 2,
        consultaDate: baseDate,
      },
      {
        id: 5,
        firstName: 'Hisoka',
        lastName: 'Morrow',
        email: 'hisoka@hunter.com',
        housingLocationId: 3,
        consultaDate: baseDate,
      },
    ];

    this.localStorageService.setAllApplications(testApplications);
  }
}
