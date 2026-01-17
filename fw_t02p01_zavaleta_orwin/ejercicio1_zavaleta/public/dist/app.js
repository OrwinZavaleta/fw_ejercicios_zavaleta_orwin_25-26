"use strict";
console.log("Orwin Zavaleta");
const CANTIDAD_COMIDAS_ALEATORIAS = 8;
document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
    cargarAleadoriosHome();
});
function comprobarSesionUsuario() {
    let sesion = localStorage.getItem("session");
    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    }
    else {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    }
}
async function cargarAleadoriosHome() {
    const contenedorAleatorios = document.querySelector("#aleatorioshome");
    if (contenedorAleatorios) {
        const todosAleatorios = await pedirTodosAleatorio();
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
async function pedirTodosAleatorio() {
    const api = new ApiService();
    const todosAleatorios = [];
    for (let i = 0; i < CANTIDAD_COMIDAS_ALEATORIAS; i++) {
        todosAleatorios.push(await api.pedirProductoRandom());
    }
    console.log(todosAleatorios);
    return todosAleatorios;
}
//# sourceMappingURL=app.js.map