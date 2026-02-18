import { MyMeal } from './my-meal';
import { User } from './user';

export enum Estado {
  QUIERO_HACERLA = 'QUIERO_HACERLA',
  LA_HE_HECHO = 'LA_HE_HECHO',
}
export interface UserMeal {
  userId: User['id'];
  mealId: MyMeal['idMeal'];
  saveDate: Date;
  status: Estado;
  notes?: string;
  rating?: number;
}
