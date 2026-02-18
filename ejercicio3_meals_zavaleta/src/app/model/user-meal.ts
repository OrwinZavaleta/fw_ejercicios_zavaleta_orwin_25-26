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

export function transformarMyMealAUserMeal(
  platoId: MyMeal['idMeal'],
  userId: User['id'],
): UserMeal {
  return {
    userId: userId,
    mealId: platoId,
    saveDate: new Date(),
    status: Estado.QUIERO_HACERLA,
  };
}
