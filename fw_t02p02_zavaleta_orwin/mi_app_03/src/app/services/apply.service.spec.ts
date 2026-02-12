import { TestBed } from '@angular/core/testing';
import { ApplyService } from './apply.service';
import { LocalStorageService } from './localstorage.service';
import { WeekDay } from '../enums/week-day';
import { InterfaceHouseForm } from '../interfaces/interface-house-form';

describe('ApplyService', () => {
  //Declaramos variables que vamos a usar en cada test
  //y que no son necesario re-crear en cada test
  let service: ApplyService;
  let localStorageService: LocalStorageService;

  const baseDate = new Date(2026, 2, 6);

  function makeApp(id: number, assignedDay?: WeekDay): InterfaceHouseForm {
    return {
      id,
      firstName: `User${id}`,
      lastName: 'Test',
      email: `user${id}@test.com`,
      housingLocationId: 1,
      consultaDate: baseDate,
      assignedDay,
    };
  }

  beforeEach(() => {
    // Limpiar localStorage para evitar contaminación entre tests
    // No confundir con localStorageService
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [ApplyService, LocalStorageService],
    });

    localStorageService = TestBed.inject(LocalStorageService);
    service = TestBed.inject(ApplyService);

    // Recuerda: Todo ocurre sobre DOM virtual
    localStorageService.setAllApplications([]);
    service.clear();
  });
  it('should be created', () => {
    console.log(service.getAppointments());
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(ApplyService);
  });

  it('should start with empty appointments after clear', () => {
    expect(service.getAppointments()).toHaveLength(0);
    expect(service.hasPendingChanges()).toBe(false);
  });

  it('should load appointments from localStorage after load()', () => {
    localStorageService.setAllApplications([
      {
        id: 1,
        firstName: 'Gon',
        lastName: 'Freecss',
        email: 'gon@hunter.com',
        housingLocationId: 1,
        consultaDate: new Date(2026, 2, 6),
        assignedDay: WeekDay.Monday,
      },
    ]);

    service.load();
    console.log(service.getAppointments());
    expect(service.getAppointments()).toHaveLength(1);
    expect(service.hasPendingChanges()).toBe(false);
  });
  it('should add appointment to working array', () => {
    const newApply = makeApp(1);
    service.addAppointment(newApply);

    const appointments = service.getAppointments();
    expect(appointments).toHaveLength(1);
    expect(appointments[0]).toEqual(newApply);
  });

  it('should mark dirty flag as true when adding appointment', () => {
    expect(service.hasPendingChanges()).toBe(false);
    service.addAppointment(makeApp(1));
    expect(service.hasPendingChanges()).toBe(true);
  });
  it('should allow adding multiple appointments', () => {
    service.addAppointment(makeApp(1));
    service.addAppointment(makeApp(2));
    service.addAppointment(makeApp(3));

    expect(service.getAppointments()).toHaveLength(3);
    expect(service.getAppointments().map((a) => a.id)).toEqual([1, 2, 3]);
  });

  it('should load appointments from LocalStorageService', () => {
    const savedData = [makeApp(1), makeApp(2, WeekDay.Monday), makeApp(3, WeekDay.Friday)];
    localStorageService.setAllApplications(savedData);

    service.load();

    expect(service.getAppointments()).toHaveLength(3);
    expect(service.getAppointments()[0].id).toBe(1);
    expect(service.getAppointments()[1].assignedDay).toBe(WeekDay.Monday);
    expect(service.getAppointments()[2].assignedDay).toBe(WeekDay.Friday);
  });

  it('should return false when assigning day to non-existent appointment', () => {
    const result = service.assignDay(999, WeekDay.Monday);
    expect(result).toBe(false);
  });

  it('should assign day when there are fewer than 2 appointments on that day', () => {
    service.addAppointment(makeApp(1)); // Sin día asignado
    service.addAppointment(makeApp(2, WeekDay.Monday)); // 1 cita en lunes

    const result = service.assignDay(1, WeekDay.Monday);

    expect(result).toBe(true);
    expect(service.getAppointmentsByDay(WeekDay.Monday)).toHaveLength(2);

    const modified = service.getAppointments().find((a) => a.id === 1);
    expect(modified?.assignedDay).toBe(WeekDay.Monday);
  });

  it('should NOT assign day when there are already 2 appointments on that day', () => {
    service.addAppointment(makeApp(1, WeekDay.Monday));
    service.addAppointment(makeApp(2, WeekDay.Monday));
    service.addAppointment(makeApp(3)); // Sin asignar

    const result = service.assignDay(3, WeekDay.Monday);

    expect(result).toBe(false);
    expect(service.getAppointmentsByDay(WeekDay.Monday)).toHaveLength(2);

    const unchanged = service.getAppointments().find((a) => a.id === 3);
    expect(unchanged?.assignedDay).toBeUndefined();
  });

  it('should return only unassigned appointments', () => {
    service.addAppointment(makeApp(1, WeekDay.Friday));
    service.addAppointment(makeApp(2)); // Sin asignar
    service.addAppointment(makeApp(3)); // Sin asignar
    service.addAppointment(makeApp(4, WeekDay.Monday));

    const unassigned = service.getUnassignedAppointments();

    expect(unassigned).toHaveLength(2);
    expect(unassigned.map((a) => a.id)).toEqual([2, 3]);
    expect(unassigned.every((a) => a.assignedDay === undefined)).toBe(true);
  });

  it('should return false when deleting non-existent id', () => {
    service.addAppointment(makeApp(1));
    service.addAppointment(makeApp(2));

    const result = service.deleteAppointmentById(999);
    expect(result).toBe(false);
    expect(service.getAppointments()).toHaveLength(2);
  });

  it('should delete appointment and return true when id exists', () => {
    service.addAppointment(makeApp(1));
    service.addAppointment(makeApp(2));
    service.addAppointment(makeApp(3));

    const result = service.deleteAppointmentById(2);

    expect(result).toBe(true);
    expect(service.getAppointments()).toHaveLength(2);
    expect(service.getAppointments().map((a) => a.id)).toEqual([1, 3]);
    expect(service.hasPendingChanges()).toBe(true);
  });

  it('should handle deleting from single-element list', () => {
    service.addAppointment(makeApp(1));
    const result = service.deleteAppointmentById(1);

    expect(result).toBe(true);
    expect(service.getAppointments()).toHaveLength(0);
  });

  // Spias
  it('should call setAllApplications when saveChanges is executed', () => {
    service.addAppointment(makeApp(1));
    service.addAppointment(makeApp(2));

    // vi.spyOn(objeto, 'nombreMétodo') crea el espía
    const spy = vi.spyOn(localStorageService, 'setAllApplications');

    service.saveChanges();

    expect(spy).toHaveBeenCalled(); // ¿Se llamó?
    expect(spy).toHaveBeenCalledTimes(1); // ¿Cuántas veces?

    // IMPORTANTE: Siempre restaurar el spy después de usarlo
    spy.mockRestore();
  });

  it('should call setAllApplications with correct data', () => {
    const app1 = makeApp(1);
    const app2 = makeApp(2, WeekDay.Monday);
    service.addAppointment(app1);
    service.addAppointment(app2);

    const spy = vi.spyOn(localStorageService, 'setAllApplications');

    service.saveChanges();

    // Verificar CON QUÉ argumentos se llamó
    expect(spy).toHaveBeenCalledWith([app1, app2]);

    // Otra forma con matchers:
    expect(spy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({ id: 2, assignedDay: WeekDay.Monday }),
      ]),
    );

    spy.mockRestore();
  });

  it('should NOT call setAllApplications when only adding appointments', () => {
    const spy = vi.spyOn(localStorageService, 'setAllApplications');

    // Solo agregar en memoria, NO guardar
    service.addAppointment(makeApp(1));
    service.addAppointment(makeApp(2));

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  // Mocks
  it('should load mocked data using spyOn (simulated return)', () => {
    const fakeData = [makeApp(100, WeekDay.Monday), makeApp(200, WeekDay.Friday)];

    // Espiamos el método real y forzamos su retorno
    const spy = vi.spyOn(localStorageService, 'getAllApplications').mockReturnValue(fakeData);

    service.load();

    expect(spy).toHaveBeenCalled();

    expect(service.getAppointments()).toHaveLength(2);
    expect(service.getAppointments().map((a) => a.id)).toEqual([100, 200]);
    spy.mockRestore();
  });

  it('should simulate empty storage using spy', () => {
    const spy = vi.spyOn(localStorageService, 'getAllApplications').mockReturnValue([]);

    service.load();

    expect(service.getAppointments()).toHaveLength(0);
    spy.mockRestore();
  });
});
