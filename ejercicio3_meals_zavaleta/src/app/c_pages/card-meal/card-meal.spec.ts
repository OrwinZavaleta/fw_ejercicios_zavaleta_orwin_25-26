import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CardMeal } from './card-meal';
import { MyMeal } from '../../model/my-meal';

describe('CardMeal', () => {
  let fixture: any;
  let component: any;

  const mockMeal: MyMeal = {
    idMeal: 52940,
    strMeal: 'Rogaliki (Polish Croissant Cookies)',
    strCategory: 'Dessert',
    strArea: 'Polish',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/rogaliki',
    ingredients: [
      { name: 'Flour', measure: '250g' },
      { name: 'Butter', measure: '200g' },
      { name: 'Sour cream', measure: '200g' },
      { name: 'Jam', measure: '100g' },
      { name: 'Egg', measure: '1' },
      { name: 'Sugar', measure: '50g' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardMeal],
      providers: [
        { provide: 'StorageService', useValue: {} },
        // { provide: 'AuthService', useValue: { isAuthorized: () => true } },
      ],
    });

    fixture = TestBed.createComponent(CardMeal);
    component = fixture.componentInstance;
  });

  it('debe renderizar correctamente los datos del plato', () => {
    // Asignar el input signal requerido
    fixture.componentRef.setInput('plato', mockMeal);

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement;

    // Verificar la imagen
    const img = nativeElement.querySelector('img.card-img-top');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toBe(mockMeal.strMeal);

    // Verificar el título del plato
    const titleLink = nativeElement.querySelector('h5.card-title a');
    expect(titleLink?.textContent?.trim()).toBe(mockMeal.strMeal);

    // Verificar categoría y área
    const cardTexts = nativeElement.querySelectorAll('.card-body .card-text');
    expect(cardTexts[0]?.textContent?.trim()).toBe(mockMeal.strCategory);
    expect(cardTexts[1]?.textContent?.trim()).toBe(mockMeal.strArea);

    // Verificar badge de ingredientes
    const badge = nativeElement.querySelector('span.badge.text-bg-secondary');
    expect(badge?.textContent?.trim()).toBe(`${mockMeal.ingredients.length} ingredientes`);

    // Verificar botón Guardar
    // const saveButton = nativeElement.querySelector('button.btn.btn-outline-warning');
    // expect(saveButton).toBeTruthy();
    // expect(saveButton?.textContent?.trim()).toBe('Guardar');
  });
});
