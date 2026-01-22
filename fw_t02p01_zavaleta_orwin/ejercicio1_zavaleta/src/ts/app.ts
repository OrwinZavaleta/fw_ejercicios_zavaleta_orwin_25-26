import { ApiService } from "./ApiService.js";
import { Category } from "./Category.js";
import { MyMeal } from "./MyMeal.js";

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
                        if (form.id == "loginForm")
                            ""; // TODO: hacer el registro y login
                        else if (form.id == "registroForm") "";
                    }

                    form.classList.add("was-validated");
                },
                false,
            );
        });
    })();
}

function comprobarSesionUsuario(): void {
    let sesion: string | null = localStorage.getItem("session");
    console.log(sesion);

    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    } else {
        document.querySelector("#menu-auth")?.classList.add("d-none");
        document.querySelector("#menu-guest")?.classList.remove("d-none");
    }
}

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
    const contenedorAleatorios: HTMLDivElement | null =
        document.querySelector("#aleatorioshome");

    if (contenedorAleatorios !== null) {
        contenedorAleatorios.innerHTML = "";

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

    const categorias: Category[] = await api.pedirTodasCategorias();

    const categoriesSelect: HTMLSelectElement | null =
        document.querySelector("#categories");

    if (categoriesSelect !== null) {
        categoriesSelect.innerHTML = `<option value="">Todas las categorías</option>`;
        categorias.forEach((categoria) => {
            categoriesSelect.innerHTML += `<option value="${categoria.strCategory}">${categoria.strCategory}</option>`;
        });

        categoriesSelect.addEventListener("change", cargarPlatosHome);
    }
}

async function pedirPlatoPorId(id: number): Promise<MyMeal> {
    const api = new ApiService();

    const plato: MyMeal = await api.pedirPlatoPorId(id);

    return plato;
}

function realizarMiValidacion(form: HTMLFormElement): boolean {
    let esValido: boolean = true;
    if (form.id == "loginForm") {
        //TODO: buscar el correo
    } else if (form.id == "registroForm") {
        if (form.password.value === form.confirmPassword.value) {
            esValido &&= true;
        } else {
            esValido &&= false;
        }
    }
    return true; // TODO: realizar las validaciones de register y login
}

function actualizarValidez(
    element: HTMLElement,
    valido: boolean,
    mensaje: string,
) {
    // element.nextElementSibling?.textContent = mensaje;
}

function cargarEventosLoginOut(): void {
    //TODO: cargar los eventos para el registro y todo
}
