import { ApiService } from "./ApiService.js";
import { Category } from "./Category.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";
import { User } from "./User";
import { StorageService } from "./StorageService.js";

declare const bootstrap: any;

console.log("Orwin Zavaleta");

const CANTIDAD_PLATOS_ALEATORIAS: number = 8;

document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
    cargarPlatosHome();
    cargarCategorias();
    cargarValidacionDeFormularios();
    cargarEventosLoginOut();
});

function cargarValidacionDeFormularios(): void {
    (() => {
        const forms: NodeListOf<HTMLFormElement> =
            document.querySelectorAll(".needs-validation");

        Array.from(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const miValidacion: boolean = realizarMiValidacion(form);

                    if (form.checkValidity() && miValidacion) {
                        if (form.id == "loginForm") iniciarSesion(form);
                        else if (form.id == "registroForm") crearUsuario(form);
                    }

                    form.classList.add("was-validated");
                },
                false,
            );
        });
    })();
}

function crearUsuario(form: HTMLFormElement) {
    const storage: StorageService = new StorageService();
    const user: User = {
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

function iniciarSesion(form: HTMLFormElement) {
    const storage: StorageService = new StorageService();
    const usuarioActual: User | null = storage.buscarUsuarioPorCorreo(
        form.email.value,
    );
    if (usuarioActual && usuarioActual.password === form.password.value) {
        storage.setUsuarioActual(usuarioActual);
        comprobarSesionUsuario();
        cerrarModalLoginOut();
        form.reset();
    } else {
        console.log("usuario no existe");
    }
}

function comprobarSesionUsuario(): void {
    let sesion: string | null = localStorage.getItem("session");
    console.log(sesion);

    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
        document.querySelector("#botonFavoritos")?.classList.remove("d-none");
        comprobarCategoriaFavorita();
    } else {
        document.querySelector("#menu-auth")?.classList.add("d-none");
        document.querySelector("#menu-guest")?.classList.remove("d-none");
        document.querySelector("#botonFavoritos")?.classList.add("d-none");
    }
}

function comprobarCategoriaFavorita() {
    const storage = new StorageService();
    const usuarioActual = storage.getUsuarioActual();

    if (usuarioActual?.favoriteCategory !== undefined) {
        (document.querySelector("#categories") as HTMLSelectElement).value =
            usuarioActual.favoriteCategory;
    }
} // TODO: cargar los platos que correspondan a la categoria

function pedirNAleatorios(cant: number, tamArray: number): number[] {
    let nRandoms: number[] = [];
    for (let i = 0; i < tamArray && i < cant; i++) {
        let random: number = Math.floor(Math.random() * tamArray);
        while (nRandoms.some((n) => n === random)) {
            random = Math.floor(Math.random() * tamArray);
        }
        nRandoms.push(random);
    }
    return nRandoms;
}

async function cargarPlatosHome(e?: Event): Promise<void> {
    const view = new ViewService();

    const contenedorAleatorios: HTMLDivElement | null =
        document.querySelector("#aleatorioshome");

    if (contenedorAleatorios !== null) {
        view.insertarTextoFormato(contenedorAleatorios, "");

        const platos: MyMeal[] = [];
        if (e) {
            const target = e.target as HTMLSelectElement;
            const platosPedidos: MyMeal[] = [];
            if (target.value == "") {
                platosPedidos.push(...(await pedirTodosAleatorio()));
            } else {
                platosPedidos.push(
                    ...(await pedirPlatosCategoria(target.value)),
                );
            }

            platos.push(...platosPedidos);
        } else {
            const todosAleatorios: MyMeal[] = await pedirTodosAleatorio();
            platos.push(...todosAleatorios);
        }

        for (
            let i = 0;
            i < platos.length && i < CANTIDAD_PLATOS_ALEATORIAS;
            i++
        ) {
            const plato = platos[i];

            view.apendizarTextoFormato(
                contenedorAleatorios,
                `
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
                        `,
            );
        }
    }
}

async function pedirPlatosCategoria(categoria: string): Promise<MyMeal[]> {
    const api = new ApiService();

    const categoriaPlatosSinProcesar: MyMeal[] =
        await api.pedirPlatosPorCategoria(categoria);

    const numeros_aleatorios = pedirNAleatorios(
        CANTIDAD_PLATOS_ALEATORIAS,
        categoriaPlatosSinProcesar.length,
    );

    const categoriaPlatos: MyMeal[] = [];
    for (
        let i = 0;
        i < categoriaPlatosSinProcesar.length && i < CANTIDAD_PLATOS_ALEATORIAS;
        i++
    ) {
        const plato = categoriaPlatosSinProcesar[numeros_aleatorios[i]];

        categoriaPlatos.push(await pedirPlatoPorId(plato.idMeal));
    }

    return categoriaPlatos;
}

async function pedirTodosAleatorio(): Promise<MyMeal[]> {
    const api = new ApiService();
    const todosAleatorios: MyMeal[] = [];
    for (let i = 0; i < CANTIDAD_PLATOS_ALEATORIAS; i++) {
        todosAleatorios.push(await api.pedirProductoRandom());
    }
    console.log(todosAleatorios);

    return todosAleatorios;
}

async function cargarCategorias(): Promise<void> {
    const api = new ApiService();
    const view = new ViewService();

    const categorias: Category[] = await api.pedirTodasCategorias();

    const categoriesSelect: HTMLSelectElement | null =
        document.querySelector("#categories");

    if (categoriesSelect !== null) {
        view.insertarTextoFormato(
            categoriesSelect,
            "<option value=''>Todas las categorías</option>",
        );

        categorias.forEach((categoria) => {
            view.apendizarTextoFormato(
                categoriesSelect,
                `<option value="${categoria.strCategory}">${categoria.strCategory}</option>`,
            );
        });

        categoriesSelect.addEventListener("change", cargarPlatosHome);
    }

    document
        .querySelector("#fijarCategoria")
        ?.addEventListener("click", fijarCategoria);
}

function fijarCategoria(): void {
    const storage = new StorageService();
    const usuarioActual = storage.getUsuarioActual();

    if (usuarioActual) {
        usuarioActual.favoriteCategory = (
            document.querySelector("#categories") as HTMLSelectElement
        ).value; // TODO: realizar comprobaciones
        storage.actualizarDatosUsuario(usuarioActual);
    }
}

async function pedirPlatoPorId(id: number): Promise<MyMeal> {
    const api = new ApiService();

    const plato: MyMeal = await api.pedirPlatoPorId(id);

    return plato;
}

function realizarMiValidacion(form: HTMLFormElement): boolean {
    let esValido: boolean = true;

    const storage: StorageService = new StorageService();

    if (form.id == "loginForm") {
        const usuarioActual: User | null = storage.buscarUsuarioPorCorreo(
            form.email.value,
        );
        if (usuarioActual && usuarioActual.password === form.password.value) {
            esValido &&= true;
        } else {
            esValido &&= false;
            actualizarValidez(
                form.password,
                false,
                "La contraseña o el correo no es valido",
            );
        }
    } else if (form.id == "registroForm") {
        if (form.password.value === form.confirmPassword.value) {
            esValido &&= true;
        } else {
            esValido &&= false;
            actualizarValidez(
                form.password,
                false,
                "La contraseña no es valida",
            );
        }
    }
    return true; // TODO: realizar las validaciones de register y login
}

function actualizarValidez(
    element: HTMLInputElement,
    valido: boolean,
    mensaje: string,
) {
    const view = new ViewService();
    const hermanoContenedorError = element.nextElementSibling;
    if (hermanoContenedorError instanceof HTMLElement) {
        view.insertarTexto(hermanoContenedorError, mensaje);
    }

    if (valido) {
        element.setCustomValidity("");
    } else {
        element.setCustomValidity("mensaje");
    }
}

function cargarEventosLoginOut(): void {
    const storage = new StorageService();
    document.querySelector("#logout")?.addEventListener("click", () => {
        storage.removeUsuarioActual();
        comprobarSesionUsuario();
    });

    const btnLogin = document.querySelector("#login") as HTMLLinkElement;
    btnLogin.addEventListener("click", function () {
        const tabLogin = new bootstrap.Tab(
            document.querySelector("#login-tab"),
        );
        tabLogin.show();
    });
    const btnRegister = document.querySelector("#register") as HTMLLinkElement;
    btnRegister.addEventListener("click", function () {
        const tabRegister = new bootstrap.Tab(
            document.querySelector("#register-tab"),
        );
        tabRegister.show();
    });
}
