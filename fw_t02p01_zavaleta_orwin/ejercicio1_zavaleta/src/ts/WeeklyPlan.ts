import { User } from "./User.js";
import { WeeklyPlanDay } from "./WeeklyPlanDay.js";

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Semanas del 01 al 09, del 10 al 49 y del 50 al 53
type WeekNumber =
    | `0${Exclude<Digit, 0>}` // 01-09
    | `${1 | 2 | 3 | 4}${Digit}` // 10-49
    | `5${0 | 1 | 2 | 3}`; // 50-53

// El formato final: Año (4 dígitos) + "-W" + Número de semana
type WeeklyPlanId = `${number}-W${WeekNumber}`;

export interface WeeklyPlan {
    id: WeeklyPlanId;
    userId: User["id"];
    days: WeeklyPlanDay[];
}
