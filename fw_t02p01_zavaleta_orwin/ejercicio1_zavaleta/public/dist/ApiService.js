"use strict";
class ApiService {
    constructor() {
        this.API_KEY = "1";
        this.API_URL = "https://www.themealdb.com/api/json/v1/" + this.API_KEY;
    }
    async pedirProductoRandom() {
        const response = await fetch(this.API_URL + "/random.php");
        const data = await response.json();
        return data.meals[0];
    }
}
//# sourceMappingURL=ApiService.js.map