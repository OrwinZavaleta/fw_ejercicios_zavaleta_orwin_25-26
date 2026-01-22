import { ApiService } from "./ApiService.js";
console.log("Orwin Zavaleta");
const CANTIDAD_PLATOS_ALEATORIAS = 8;
document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
    cargarPlatosHome();
    cargarCategorias();
    cargarValidacionDeFormularios();
    cargarEventosLoginOut();
});
function cargarValidacionDeFormularios() {
    (() => {
        const forms = document.querySelectorAll(".needs-validation");
        Array.from(forms).forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const miValidacion = realizarMiValidacion(form);
                if (form.checkValidity() && miValidacion) {
                    if (form.id == "loginForm")
                        ""; // TODO: hacer el registro y login
                    else if (form.id == "registroForm")
                        "";
                }
                form.classList.add("was-validated");
            }, false);
        });
    })();
}
function comprobarSesionUsuario() {
    let sesion = localStorage.getItem("session");
    console.log(sesion);
    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    }
    else {
        document.querySelector("#menu-auth")?.classList.add("d-none");
        document.querySelector("#menu-guest")?.classList.remove("d-none");
    }
}
function pedirNAleatorios(cant, tamArray) {
    let nRandoms = [];
    for (let i = 0; i < tamArray && i < cant; i++) {
        let random = Math.floor(Math.random() * tamArray);
        while (nRandoms.some((n) => n === random)) {
            random = Math.floor(Math.random() * tamArray);
        }
        nRandoms.push(random);
    }
    return nRandoms;
}
async function cargarPlatosHome(e) {
    const contenedorAleatorios = document.querySelector("#aleatorioshome");
    if (contenedorAleatorios !== null) {
        contenedorAleatorios.innerHTML = "";
        const platos = [];
        if (e) {
            const target = e.target;
            const platosPedidos = [];
            if (target.value == "") {
                platosPedidos.push(...(await pedirTodosAleatorio()));
            }
            else {
                platosPedidos.push(...(await pedirPlatosCategoria(target.value)));
            }
            platos.push(...platosPedidos);
        }
        else {
            const todosAleatorios = await pedirTodosAleatorio();
            platos.push(...todosAleatorios);
        }
        for (let i = 0; i < platos.length && i < CANTIDAD_PLATOS_ALEATORIAS; i++) {
            const plato = platos[i];
            contenedorAleatorios.innerHTML += `
                        <div class="col">
                            <div class="card">
                                <img src="${plato.strMealThumb}" class="card-img-top" alt="..."> // TODO: poner la imagen en mediano
                                <div class="card-body">
                                    <h5 class="card-title">${plato.strMeal}</h5>
                                    <p class="card-text">${plato.strCategory}</p>
                                    <p class="card-text">${plato.strArea}</p>
                                    <p class="card-text">${plato.strCategory}</p> // TODO: convertir la llamada para que encaje con la interfaz
                                </div>
                            </div>
                        </div>
                        `;
        }
    }
}
async function pedirPlatosCategoria(categoria) {
    const api = new ApiService();
    const categoriaPlatosSinProcesar = await api.pedirPlatosPorCategoria(categoria);
    const numeros_aleatorios = pedirNAleatorios(CANTIDAD_PLATOS_ALEATORIAS, categoriaPlatosSinProcesar.length);
    const categoriaPlatos = [];
    for (let i = 0; i < categoriaPlatosSinProcesar.length && i < CANTIDAD_PLATOS_ALEATORIAS; i++) {
        const plato = categoriaPlatosSinProcesar[numeros_aleatorios[i]];
        categoriaPlatos.push(await pedirPlatoPorId(plato.idMeal));
    }
    return categoriaPlatos;
}
async function pedirTodosAleatorio() {
    const api = new ApiService();
    const todosAleatorios = [];
    for (let i = 0; i < CANTIDAD_PLATOS_ALEATORIAS; i++) {
        todosAleatorios.push(await api.pedirProductoRandom());
    }
    console.log(todosAleatorios);
    return todosAleatorios;
}
async function cargarCategorias() {
    const api = new ApiService();
    const categorias = await api.pedirTodasCategorias();
    const categoriesSelect = document.querySelector("#categories");
    if (categoriesSelect !== null) {
        categoriesSelect.innerHTML = `<option value="">Todas las categorías</option>`;
        categorias.forEach((categoria) => {
            categoriesSelect.innerHTML += `<option value="${categoria.strCategory}">${categoria.strCategory}</option>`;
        });
        categoriesSelect.addEventListener("change", cargarPlatosHome);
    }
}
async function pedirPlatoPorId(id) {
    const api = new ApiService();
    const plato = await api.pedirPlatoPorId(id);
    return plato;
}
function realizarMiValidacion(form) {
    let esValido = true;
    if (form.id == "loginForm") {
        //TODO: buscar el correo
    }
    else if (form.id == "registroForm") {
        if (form.password.value === form.confirmPassword.value) {
            esValido && (esValido = true);
        }
        else {
            esValido && (esValido = false);
        }
    }
    return true; // TODO: realizar las validaciones de register y login
}
function actualizarValidez(element, valido, mensaje) {
    // element.nextElementSibling?.textContent = mensaje;
}
function cargarEventosLoginOut() {
    //TODO: cargar los eventos para el registro y todo
}
//# sourceMappingURL=app.js.map