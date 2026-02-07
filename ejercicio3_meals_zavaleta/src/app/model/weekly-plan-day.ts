import { MyMeal } from "./my-meal";

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
