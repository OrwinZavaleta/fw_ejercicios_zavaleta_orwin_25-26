import { ApiService } from "./ApiService.js";
import { Category } from "./Category.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";
import { User } from "./User";
import { StorageService } from "./StorageService.js";
import { UserMeal } from "./UserMeal.js";

console.log("home.ts");

const CANTIDAD_PLATOS_ALEATORIAS: number = 8;
const CANTIDAD_PLATOS_FAVORITOS: number = 4;

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    comprobarSesionUsuarioHome();
    cargarPlatosHome();
});

function comprobarSesionUsuarioHome(): void {
    let sesion: string | null = localStorage.getItem("session");
    const view = new ViewService();
    const storage = new StorageService();
    console.log(sesion);

    if (storage.getUsuarioActual()) {
        view.mostrarElement(
            document.querySelector("#botonFavoritos") as HTMLDivElement,
            true,
        );
        view.mostrarElement(
            document.querySelector("#contenedorFavoritos") as HTMLDivElement,
            true,
        );
        comprobarCategoriaFavorita();
        cargarFavoritos();
    } else {
        view.mostrarElement(
            document.querySelector("#botonFavoritos") as HTMLDivElement,
            false,
        );
        view.mostrarElement(
            document.querySelector("#contenedorFavoritos") as HTMLDivElement,
            false,
        );
    }
}

async function cargarFavoritos() {
    const view = new ViewService();
    const storage = new StorageService();
    const api = new ApiService();

    const usuario = storage.getUsuarioActual();
    const platosFavoritosSinProcesar: UserMeal[] = [];
    const platosFavoritos: MyMeal[] = [];
    if (usuario) {
        platosFavoritosSinProcesar.push(
            ...storage.getPlatosFavoritos(usuario.id),
        );
    }
    console.log("Aqui");
    console.log(platosFavoritosSinProcesar);

    for (
        let i = platosFavoritosSinProcesar.length - 1;
        i >= 0 &&
        i >= platosFavoritosSinProcesar.length - CANTIDAD_PLATOS_FAVORITOS;
        i--
    ) {
        console.log(i);

        platosFavoritos.push(
            await api.pedirPlatoPorId(platosFavoritosSinProcesar[i].mealId),
        );
    }

    view.pintarPlatos(
        platosFavoritos,
        document.querySelector("#platosFavoritos") as HTMLDivElement,
        CANTIDAD_PLATOS_FAVORITOS,
    );
}

function comprobarCategoriaFavorita() {
    const storage = new StorageService();
    const usuarioActual = storage.getUsuarioActual();

    if (usuarioActual?.favoriteCategory !== undefined) {
        (document.querySelector("#categories") as HTMLSelectElement).value =
            usuarioActual.favoriteCategory;
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

export async function cargarPlatosHome(e?: Event): Promise<void> {
    const view = new ViewService();
    const storage = new StorageService();
    let favUsuario: undefined | string = undefined;
    let favSelected = false;
    if (storage.getUsuarioActual()?.favoriteCategory) {
        favUsuario = storage.getUsuarioActual()?.favoriteCategory;
    }

    const contenedorAleatorios: HTMLDivElement | null =
        document.querySelector("#aleatorioshome");

    if (contenedorAleatorios !== null) {
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
                if (favUsuario === target.value) favSelected = true;
            }

            platos.push(...platosPedidos);
        } else {
            const platosPedidos: MyMeal[] = [];
            if (favUsuario) {
                platosPedidos.push(...(await pedirPlatosCategoria(favUsuario)));
                favSelected = true;
            } else {
                platosPedidos.push(...(await pedirTodosAleatorio()));
            }
            platos.push(...platosPedidos);
        }

        view.pintarPlatos(
            platos,
            contenedorAleatorios,
            CANTIDAD_PLATOS_ALEATORIAS,
            document.querySelector("#fijarCategoria") as HTMLButtonElement,
            favSelected,
        );
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

    const categoriesSelect = document.querySelector(
        "#categories",
    ) as HTMLSelectElement;

    view.pintarCategorias(categorias, categoriesSelect);
}

async function pedirPlatoPorId(id: number): Promise<MyMeal> {
    const api = new ApiService();

    const plato: MyMeal = await api.pedirPlatoPorId(id);

    return plato;
}
