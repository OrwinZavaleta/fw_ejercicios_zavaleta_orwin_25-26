import { MyMeal } from "./MyMeal.js";

type DayOfWeek =
    | "lunes"
    | "martes"
    | "miércoles"
    | "jueves"
    | "viernes"
    | "sábado"
    | "domingo";

export interface WeeklyPlanDay {
    day: DayOfWeek;
    lunchMealId?: MyMeal["idMeal"];
    dinnerMealId?: MyMeal["idMeal"];
}
// id debe coincidir exactamente con el idMeal de la API
