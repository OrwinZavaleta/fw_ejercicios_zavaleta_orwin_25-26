console.log("Orwin Zavaleta");

const CANTIDAD_COMIDAS_ALEATORIAS: number = 8;

document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
    cargarAleadoriosHome();
});

function comprobarSesionUsuario(): void {
    let sesion: string | null = localStorage.getItem("session");

    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    } else {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    }
}

async function cargarAleadoriosHome(): Promise<void> {
    const contenedorAleatorios: Element | null =
        document.querySelector("#aleatorioshome");

    if (contenedorAleatorios) {
        const todosAleatorios: MyMeal[] = await pedirTodosAleatorio();

        contenedorAleatorios.innerHTML = "";

        todosAleatorios.forEach((comida) => {
            contenedorAleatorios.innerHTML += `
                <div class="col">
                    <div class="card">
                        <img src="${comida.strMealThumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${comida.strMeal}</h5>
                            <p class="card-text">${comida.strCategory}</p>
                        </div>
                    </div>
                </div>
                `;
        });
    }
}

async function pedirTodosAleatorio(): Promise<MyMeal[]> {
    const api = new ApiService();
    const todosAleatorios: MyMeal[] = [];
    for (let i = 0; i < CANTIDAD_COMIDAS_ALEATORIAS; i++) {
        todosAleatorios.push(await api.pedirProductoRandom());
    }
    console.log(todosAleatorios);
    
    return todosAleatorios;
}
