export class ApiService {
    constructor() {
        this.API_KEY = "1";
        this.API_URL = "https://www.themealdb.com/api/json/v1/" + this.API_KEY;
    }
    async pedirProductoRandom() {
        const response = await fetch(this.API_URL + "/random.php");
        const data = await response.json();
        return data.meals[0];
    }
    async pedirTodasCategorias() {
        const response = await fetch(this.API_URL + "/categories.php");
        const data = await response.json();
        return data.categories.sort((a, b) => a.strCategory.localeCompare(b.strCategory));
    }
    async pedirPlatosPorCategoria(categoria) {
        const response = await fetch(this.API_URL + `/filter.php?c=${categoria}`);
        const data = await response.json();
        return data.meals;
    }
    async pedirPlatoPorId(id) {
        const response = await fetch(this.API_URL + `/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals[0];
    }
}
//# sourceMappingURL=ApiService.js.map