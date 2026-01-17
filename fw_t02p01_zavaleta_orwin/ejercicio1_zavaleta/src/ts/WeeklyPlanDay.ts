interface WeeklyPlanDay {
    day: string; /* (lunes, martes, etc.) */
    lunchMealId?: MyMeal["idMeal"];
    dinnerMealId?: MyMeal["idMeal"];
}
// id debe coincidir exactamente con el idMeal de la API
