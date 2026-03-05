// example.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { MealsCategory } from './meals-category';
import { MyMeal } from '../../model/my-meal';
import { CardMeal } from '../card-meal/card-meal';
import { signal } from '@angular/core';

describe('MealsCategory', () => {
  let fixture: any;
  let component: any;
  // Configuración común antes de cada prueba
  beforeEach(async () => {
    // Configurar el módulo de pruebas e importar el componente standalone
    await TestBed.configureTestingModule({
      imports: [MealsCategory, CardMeal], // Los componentes standalone se importan aquí
    }).compileComponents(); // Compila plantillas externas si las hubiera
    fixture = TestBed.createComponent(MealsCategory);
    component = fixture.componentInstance;

    vi.clearAllMocks();
  });

  it('should create the component', () => {
    // Crear el fixture del componente
    const fixture = TestBed.createComponent(MealsCategory);
    const component = fixture.componentInstance;

    // Verificar que el componente existe
    expect(component).toBeTruthy();
  });

  it('debe renderizar el card-meal 8 veces', async () => {
    // Detectar cambios para que se renderice la plantilla
    fixture.detectChanges();
    await fixture.whenStable();

    // Contar cuántas veces se renderiza app-card-meal
    const cards = fixture.nativeElement.querySelectorAll('app-card-meal');

    expect(cards.length).toBe(8);
  });
});
