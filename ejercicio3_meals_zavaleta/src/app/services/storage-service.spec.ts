import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage-service';
import { WeeklyPlan } from '../model/weekly-plan';
import { User } from '../model/user';

describe('StorageService - PlanSemanal', () => {
  let service: StorageService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    password: '1234',
  };

  const mockPlan: WeeklyPlan = {
    id: '2026-W10',
    userId: 1,
    days: [
      { day: 'lunes', lunchMealId: 52940 },
      { day: 'martes', dinnerMealId: 52941 },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    // Registrar y autenticar usuario
    service.guardarAgregarUsuario(mockUser);
    service.setUsuarioActual(mockUser);
  });

  it('debe guardar un plan semanal correctamente', () => {
    service.guardarPlanSemanal(mockPlan);

    const planes = service.getPlanesSemanales();
    expect(planes).toHaveLength(1);
    expect(planes[0].id).toBe('2026-W10');
    expect(planes[0].userId).toBe(1);
  });

  it('debe retornar un array vacío si no hay planes guardados', () => {
    const planes = service.getPlanesSemanales();
    expect(planes).toEqual([]);
  });

  it('debe guardar múltiples planes semanales', () => {
    const otroPlan: WeeklyPlan = {
      id: '2026-W11',
      userId: 1,
      days: [{ day: 'viernes', lunchMealId: 52942 }],
    };

    service.guardarPlanSemanal(mockPlan);
    service.guardarPlanSemanal(otroPlan);

    const planes = service.getPlanesSemanales();
    expect(planes).toHaveLength(2);
    expect(planes[0].id).toBe('2026-W10');
    expect(planes[1].id).toBe('2026-W11');
  });

  it('debe lanzar error si no hay sesión activa al guardar', () => {
    service.removeUsuarioActual();
    expect(() => service.guardarPlanSemanal(mockPlan)).toThrow('No hay sesión activa.');
  });

  it('debe lanzar error si no hay sesión activa al obtener planes', () => {
    service.removeUsuarioActual();
    expect(() => service.getPlanesSemanales()).toThrow('No hay sesión activa.');
  });
});
