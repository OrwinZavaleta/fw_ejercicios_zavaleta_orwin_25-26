import { ApiService } from "./ApiService.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
import { Estado, UserMeal } from "./UserMeal.js";

console.log("details.ts");

document.addEventListener("DOMContentLoaded", () => {
    cargarDetallesPlato();
    asignarEventos();
    comprobarSesionUsuarioDetalle();
    cargarValidacionDeFormularios();
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
    const storage = new StorageService();
    const botnFav = document.querySelector(
        "#platoFavorito",
    ) as HTMLButtonElement;
    const opinionFav = document.querySelector(
        "#detallesForm",
    ) as HTMLDivElement;
    let sesion: string | null = localStorage.getItem("session");
    console.log(sesion);

    if (storage.getUsuarioActual()) {
        view.mostrarElement(botnFav, true);
        view.activarDesactivarBoton(
            botnFav,
            platoActualEnFavoritos(Number(obtenerId())),
        );
        cargarValoresOpinion();
    } else {
        view.mostrarElement(botnFav, false);
        view.mostrarElement(opinionFav, false);
    }
}

function cargarValoresOpinion() {
    const storage = new StorageService();
    const user = storage.getUsuarioActual()?.id;
    const view = new ViewService();

    if (user && platoActualEnFavoritos(Number(obtenerId()))) {
        const platoActual = storage.buscarPlatoFavoritoPorId(
            Number(obtenerId()),
            user,
        );

        (document.querySelector("#hecho") as HTMLInputElement).checked =
            platoActual?.status === Estado.LA_HE_HECHO ? true : false;
        view.insertarTexto(
            document.querySelector("#opinion") as HTMLInputElement,
            platoActual?.notes ?? "",
        );

        const estrellas = document.querySelectorAll(
            ".bi.bi-star",
        ) as NodeListOf<HTMLElement>;
        if (platoActual?.rating) {
            for (let i = 0; i < platoActual?.rating; i++) {
                view.estrellaPintada(estrellas[i], true);
            }
            (document.querySelector("#rating") as HTMLInputElement).value =
                platoActual.rating + "";
        }
    }
}

function asignarEventos(): void {
    (
        document.querySelector("#platoFavorito") as HTMLButtonElement
    ).addEventListener("click", handleBotonFavoritos);
    cargarEventosRating();
    (
        document.querySelector("#resetearForm") as HTMLButtonElement
    ).addEventListener("click", resetearFormOpinion);
}

function cargarEventosRating() {
    const estrellas = document.querySelectorAll(
        ".bi.bi-star",
    ) as NodeListOf<HTMLElement>;
    const view = new ViewService();
    console.log(estrellas);

    const rating = document.querySelector("#rating") as HTMLInputElement;

    for (let i = 0; i < estrellas.length; i++) {
        const element = estrellas[i];

        element.addEventListener("click", () => {
            rating.value = i + 1 + "";
            let prev: Element | null = element;
            let next: Element | null = element.nextElementSibling;
            while (prev !== null) {
                view.estrellaPintada(prev, true);
                prev = prev.previousElementSibling;
            }
            while (next !== null) {
                view.estrellaPintada(next, false);
                next = next.nextElementSibling;
            }
        });
    }
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
            resetearFormOpinion();
            view.mostrarElement(formFavorito, false);
        } else {
            view.activarDesactivarBoton(boton, true);
            storage.guardarPlatoFavorito(userMeal, userMeal.userId);
            view.mostrarElement(formFavorito, true);
        }
    } catch (error) {
        console.log(error);
    }
}

function resetearFormOpinion() {
    const view = new ViewService();
    const form = document.querySelector("#guardarOpinion") as HTMLFormElement;
    form.reset();
    form.rating.value = 0;
    const estrellas = document.querySelectorAll(
        ".bi.bi-star-fill",
    ) as NodeListOf<HTMLElement>;
    for (let i = 0; i < estrellas.length; i++) {
        view.estrellaPintada(estrellas[i], false);
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

function cargarValidacionDeFormularios() {
    // TODO: revisar si hace falta o con la de app.ts basta
    (() => {
        const forms: NodeListOf<HTMLFormElement> =
            document.querySelectorAll(".needs-validation");

        Array.from(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const esValido = realizarMiValidacion(form);

                    if (form.checkValidity() && esValido) {
                        handleOpinionFormulario(form);
                        console.log("es valido");
                    } else {
                        console.log("no valido");

                        form.classList.add("was-validated");
                    }
                },
                false,
            );
        });
    })();
}

function realizarMiValidacion(form: HTMLFormElement): boolean {
    const view = new ViewService();
    let isValid = true;

    if (form.estado.value === Estado.LA_HE_HECHO) {
        if (!form.rating || form.rating.value == 0) {
            view.actualizarValidez(
                form.rating,
                false,
                "Ha marcado como Hecha, por favor deje una calificación.",
            );
            form.rating.classList.add("is-invalid");
            isValid &&= false;
        } else {
            view.actualizarValidez(form.rating, true, "");
            isValid &&= true;
            form.rating.classList.remove("is-invalid");
        }
    } else if (form.estado.value === Estado.QUIERO_HACERLA) {
        view.actualizarValidez(form.rating, true, "");
        isValid &&= true;
        form.rating.classList.remove("is-invalid");
    }
    return isValid;
}

function handleOpinionFormulario(form: HTMLFormElement) {
    const storage = new StorageService();
    const view = new ViewService();
    const userMeal = transformarMyMealAUserMeal(Number(obtenerId()));
    userMeal.status = form.estado.value;
    userMeal.notes = form.opinion.value;
    userMeal.rating = form.rating.value;

    storage.actualizarPlatoFavorito(userMeal, userMeal.userId);

    form.classList.remove("was-validated");

    view.mostrarNotificacionEstado(true, "Se guardo correctamente.");
}
