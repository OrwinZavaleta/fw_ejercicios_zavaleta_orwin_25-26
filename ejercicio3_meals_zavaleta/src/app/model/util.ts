import { MyMeal } from './my-meal';
import { User } from './user';
import { UserMeal, Estado } from './user-meal';
import { UserMiniMeal } from './user-mini-meal';
import { WeeklyPlan } from './weekly-plan';

export class Util {
  static getISOWeek(date: Date): WeeklyPlan['id'] {
    // 1. Clonar la fecha en UTC (sin modificar la original)
    // Usamos UTC para evitar problemas de zona horaria y DST
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // 2. Alinear al jueves de la semana actual
    // getUTCDay(): 0 (Dom) - 6 (Sáb)
    // ISO 8601: 1 (Lun) - 7 (Dom), por eso usamos (day || 7)
    // Jueves = día 4 en ISO
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

    // 3. Obtener el año ISO (el año del jueves calculado)
    const isoYear = d.getUTCFullYear();

    // 4. Obtener el 1 de enero del año ISO
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));

    // 5. Calcular el número de semana
    // Diferencia en milisegundos convertida a días, +1 porque el día 1 cuenta
    // Math.ceil para redondear hacia arriba a la semana completa
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

    // 6. Formato de salida "YYYY-WXX"
    return `${isoYear}-W${weekNo.toString().padStart(2, '0')}` as WeeklyPlan['id'];
  }

  static pedirNAleatorios(cant: number, tamArray: number): number[] {
    let nRandoms: number[] = [];
    for (let i = 0; i < tamArray && i < cant; i++) {
      let random: number = Math.floor(Math.random() * tamArray);
      while (nRandoms.some((n) => n === random)) {
        random = Math.floor(Math.random() * tamArray);
      }
      nRandoms.push(random);
    }
    return nRandoms;
  }

  static transformarMyMealAUserMeal(platoId: MyMeal['idMeal'], userId: User['id']): UserMeal {
    return {
      userId: userId,
      mealId: platoId,
      saveDate: new Date(),
      status: Estado.QUIERO_HACERLA,
    };
  }

  static transformarMyMealAMiniMeal(plato: MyMeal): UserMiniMeal {
    return {
      id: plato.idMeal,
      name: plato.strMeal,
      image_small: plato.strMealThumb + "/small"
    };
  }
}
