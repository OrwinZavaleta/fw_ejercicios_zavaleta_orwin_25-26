interface WeeklyPlan {
    id: string; /* (formato YYYY-WXX) */ // TODO
    userId: User["id"];
    days: WeeklyPlanDay[];
}
