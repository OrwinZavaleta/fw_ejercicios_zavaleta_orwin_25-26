class ApiService {
    private API_KEY: string = "1";
    private API_URL: string =
        "https://www.themealdb.com/api/json/v1/" + this.API_KEY;

    constructor() {}

    public async pedirProductoRandom(): Promise<MyMeal> {
        const response: Response = await fetch(this.API_URL + "/random.php");
        const data = await response.json();

        return data.meals[0];
    }
}
