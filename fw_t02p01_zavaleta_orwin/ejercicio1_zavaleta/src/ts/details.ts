import { ApiService } from "./ApiService.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
import { Estado, UserMeal } from "./UserMeal.js";

console.log("details.ts");

document.addEventListener("DOMContentLoaded", () => {
    cargarDetallesPlato();
    comprobarSesionUsuarioDetalle();
    asignarEventos();
});

async function cargarDetallesPlato(): Promise<void> {
    const id: string = obtenerId();
    const view = new ViewService();
    const api = new ApiService();

    const plato: MyMeal = await api.pedirPlatoPorId(Number(id));

    view.pintarVistaDetalleProducto(plato);
}

function obtenerId(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const miId = urlParams.get("id");

    if (!miId) throw new Error("No hay ningun producto seleccionado");

    console.log(miId);
    return miId;
}

function comprobarSesionUsuarioDetalle(): void {
    const view = new ViewService();
    let sesion: string | null = localStorage.getItem("session");
    console.log(sesion);

    if (typeof sesion === "string") {
        view.activarDesactivarBoton(
            document.querySelector("#platoFavorito") as HTMLButtonElement,
            platoActualEnFavoritos(Number(obtenerId())),
        );
    } else {
    }
}

function asignarEventos(): void {
    (
        document.querySelector("#platoFavorito") as HTMLButtonElement
    ).addEventListener("click", handleBotonFavoritos);
}

function handleBotonFavoritos(e: Event) {
    const view = new ViewService();
    const storage = new StorageService();
    const boton = e.target as HTMLButtonElement;
    const formFavorito = document.querySelector(
        "#detallesForm",
    ) as HTMLDivElement;
    try {
        const userMeal = transformarMyMealAUserMeal(Number(obtenerId()));

        if (boton?.classList.contains("active")) {
            view.activarDesactivarBoton(boton, false);
            storage.quitarPlatoFavorito(Number(obtenerId()), userMeal.userId);
            formFavorito.classList.add("d-none");
        } else {
            view.activarDesactivarBoton(boton, true);
            storage.guardarPlatoFavorito(userMeal, userMeal.userId);
            formFavorito.classList.remove("d-none");
        }
    } catch (error) {
        console.log(error);
    }
}

function transformarMyMealAUserMeal(platoId: MyMeal["idMeal"]): UserMeal {
    const storage = new StorageService();
    const userId = storage.getUsuarioActual()?.id;
    if (!userId) throw new Error("El usuario no existe");
    return {
        userId: userId,
        mealId: platoId,
        saveDate: new Date(),
        status: Estado.QUIERO_HACERLA,
    };
}

function platoActualEnFavoritos(idMeal: MyMeal["idMeal"]): boolean {
    const storage = new StorageService();
    const userId = storage.getUsuarioActual()?.id;
    if (!userId) throw new Error("El usuario no existe");
    const platoActualFav = storage.buscarPlatoFavoritoPorId(idMeal, userId);
    if (platoActualFav) {
        return true;
    } else {
        return false;
    }
}
