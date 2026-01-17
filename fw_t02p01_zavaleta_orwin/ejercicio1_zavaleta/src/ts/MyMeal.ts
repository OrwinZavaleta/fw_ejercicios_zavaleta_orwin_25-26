interface MyMeal { // TODO: preguntar si uso los nombres con el que llega en la api, o como se convierten los nombres
    idMeal: number;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
    ingredients: { name: string; measure: string }[];
}
