import { ApiService } from "./ApiService.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
console.log("Orwin Zavaleta");
const CANTIDAD_PLATOS_ALEATORIAS = 8;
document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    comprobarSesionUsuario();
    cargarPlatosHome();
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
                        iniciarSesion(form);
                    else if (form.id == "registroForm")
                        crearUsuario(form);
                }
                form.classList.add("was-validated");
            }, false);
        });
    })();
}
function crearUsuario(form) {
    const storage = new StorageService();
    const user = {
        id: 1,
        name: form.usuario.value,
        email: form.correo.value,
        password: form.password.value,
    };
    form.reset();
    storage.guardarAgregarUsuario(user);
    comprobarSesionUsuario();
    cerrarModalLoginOut();
}
function cerrarModalLoginOut() {
    const modal = document.querySelector("#loginOut");
    if (modal) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
        modalInstance.hide();
    }
}
function iniciarSesion(form) {
    const storage = new StorageService();
    const usuarioActual = storage.buscarUsuarioPorCorreo(form.email.value);
    if (usuarioActual && usuarioActual.password === form.password.value) {
        storage.setUsuarioActual(usuarioActual);
        comprobarSesionUsuario();
        cerrarModalLoginOut();
        form.reset();
    }
    else {
        console.log("usuario no existe");
    }
}
function comprobarSesionUsuario() {
    let sesion = localStorage.getItem("session");
    console.log(sesion);
    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
        document.querySelector("#botonFavoritos")?.classList.remove("d-none");
        comprobarCategoriaFavorita();
    }
    else {
        document.querySelector("#menu-auth")?.classList.add("d-none");
        document.querySelector("#menu-guest")?.classList.remove("d-none");
        document.querySelector("#botonFavoritos")?.classList.add("d-none");
    }
}
function comprobarCategoriaFavorita() {
    const storage = new StorageService();
    const usuarioActual = storage.getUsuarioActual();
    if (usuarioActual?.favoriteCategory !== undefined) {
        document.querySelector("#categories").value =
            usuarioActual.favoriteCategory;
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
    const view = new ViewService();
    const storage = new StorageService();
    let favUsuario = undefined;
    if (storage.getUsuarioActual()?.favoriteCategory) {
        favUsuario = storage.getUsuarioActual()?.favoriteCategory;
    }
    const contenedorAleatorios = document.querySelector("#aleatorioshome");
    if (contenedorAleatorios !== null) {
        view.insertarTextoFormato(contenedorAleatorios, "");
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
            const platosPedidos = [];
            if (favUsuario) {
                platosPedidos.push(...(await pedirPlatosCategoria(favUsuario)));
            }
            else {
                platosPedidos.push(...(await pedirTodosAleatorio()));
            }
            platos.push(...platosPedidos);
        }
        for (let i = 0; i < platos.length && i < CANTIDAD_PLATOS_ALEATORIAS; i++) {
            const plato = platos[i];
            view.apendizarTextoFormato(contenedorAleatorios, `
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
                        `);
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
    const view = new ViewService();
    const categorias = await api.pedirTodasCategorias();
    const categoriesSelect = document.querySelector("#categories");
    if (categoriesSelect !== null) {
        view.insertarTextoFormato(categoriesSelect, "<option value=''>Todas las categorías</option>");
        categorias.forEach((categoria) => {
            view.apendizarTextoFormato(categoriesSelect, `<option value="${categoria.strCategory}">${categoria.strCategory}</option>`);
        });
        categoriesSelect.addEventListener("change", cargarPlatosHome);
    }
    document
        .querySelector("#fijarCategoria")
        ?.addEventListener("click", fijarDesfijarCategoria);
}
function fijarDesfijarCategoria() {
    const storage = new StorageService();
    const usuarioActual = storage.getUsuarioActual();
    const boton = document.querySelector("#fijarCategoria");
    if (usuarioActual) {
        if (boton?.classList.contains("active")) {
            usuarioActual.favoriteCategory = undefined;
            boton?.classList.remove("active");
            storage.actualizarDatosUsuario(usuarioActual);
        }
        else {
            const categoriaAAsignar = document.querySelector("#categories").value;
            if (categoriaAAsignar &&
                categoriaAAsignar !== null &&
                categoriaAAsignar !== undefined) {
                usuarioActual.favoriteCategory = categoriaAAsignar;
                storage.actualizarDatosUsuario(usuarioActual);
                boton?.classList.add("active");
            }
        }
    }
}
async function pedirPlatoPorId(id) {
    const api = new ApiService();
    const plato = await api.pedirPlatoPorId(id);
    return plato;
}
function realizarMiValidacion(form) {
    let esValido = true;
    const storage = new StorageService();
    if (form.id == "loginForm") {
        const usuarioActual = storage.buscarUsuarioPorCorreo(form.email.value);
        if (usuarioActual && usuarioActual.password === form.password.value) {
            esValido && (esValido = true);
        }
        else {
            esValido && (esValido = false);
            actualizarValidez(form.password, false, "La contraseña o el correo no es valido");
        }
    }
    else if (form.id == "registroForm") {
        if (form.password.value === form.confirmPassword.value) {
            esValido && (esValido = true);
        }
        else {
            esValido && (esValido = false);
            actualizarValidez(form.password, false, "La contraseña no es valida");
        }
    }
    return true; // TODO: realizar las validaciones de register y login
}
function actualizarValidez(element, valido, mensaje) {
    const view = new ViewService();
    const hermanoContenedorError = element.nextElementSibling;
    if (hermanoContenedorError instanceof HTMLElement) {
        view.insertarTexto(hermanoContenedorError, mensaje);
    }
    if (valido) {
        element.setCustomValidity("");
    }
    else {
        element.setCustomValidity("mensaje");
    }
}
function cargarEventosLoginOut() {
    const storage = new StorageService();
    document.querySelector("#logout")?.addEventListener("click", () => {
        storage.removeUsuarioActual();
        comprobarSesionUsuario();
    });
    const btnLogin = document.querySelector("#login");
    btnLogin.addEventListener("click", function () {
        const tabLogin = new bootstrap.Tab(document.querySelector("#login-tab"));
        tabLogin.show();
    });
    const btnRegister = document.querySelector("#register");
    btnRegister.addEventListener("click", function () {
        const tabRegister = new bootstrap.Tab(document.querySelector("#register-tab"));
        tabRegister.show();
    });
}
//# sourceMappingURL=app.js.map