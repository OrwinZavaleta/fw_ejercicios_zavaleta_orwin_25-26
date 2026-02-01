export interface MyMeal { 
    idMeal: number;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
    ingredients: { name: string; measure: string }[];
}
