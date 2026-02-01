import { ApiService } from "./ApiService.js";
import { ViewService } from "./ViewService.js";
import { StorageService } from "./StorageService.js";
import { Estado } from "./UserMeal.js";
console.log("details.ts");
document.addEventListener("DOMContentLoaded", () => {
    cargarDetallesPlato();
    comprobarSesionUsuarioDetalle();
    asignarEventos();
    cargarValidacionDeFormularios();
});
async function cargarDetallesPlato() {
    const id = obtenerId();
    const view = new ViewService();
    const api = new ApiService();
    const plato = await api.pedirPlatoPorId(Number(id));
    view.pintarVistaDetalleProducto(plato);
}
function obtenerId() {
    const urlParams = new URLSearchParams(window.location.search);
    const miId = urlParams.get("id");
    if (!miId)
        throw new Error("No hay ningun producto seleccionado");
    console.log(miId);
    return miId;
}
function comprobarSesionUsuarioDetalle() {
    const view = new ViewService();
    const storage = new StorageService();
    const botnFav = document.querySelector("#platoFavorito");
    const opinionFav = document.querySelector("#detallesForm");
    let sesion = localStorage.getItem("session");
    console.log(sesion);
    if (storage.getUsuarioActual()) {
        view.mostrarElement(botnFav, true);
        view.activarDesactivarBoton(botnFav, platoActualEnFavoritos(Number(obtenerId())));
        cargarValoresOpinion();
    }
    else {
        view.mostrarElement(botnFav, false);
        view.mostrarElement(opinionFav, false);
    }
}
function cargarValoresOpinion() {
    const storage = new StorageService();
    const user = storage.getUsuarioActual()?.id;
    const view = new ViewService();
    if (user && platoActualEnFavoritos(Number(obtenerId()))) {
        const platoActual = storage.buscarPlatoFavoritoPorId(Number(obtenerId()), user);
        document.querySelector("#hecho").checked =
            platoActual?.status === Estado.LA_HE_HECHO ? true : false;
        view.insertarTexto(document.querySelector("#opinion"), platoActual?.notes ?? "");
    }
}
function asignarEventos() {
    document.querySelector("#platoFavorito").addEventListener("click", handleBotonFavoritos);
}
function handleBotonFavoritos(e) {
    const view = new ViewService();
    const storage = new StorageService();
    const boton = e.target;
    const formFavorito = document.querySelector("#detallesForm");
    try {
        const userMeal = transformarMyMealAUserMeal(Number(obtenerId()));
        if (boton?.classList.contains("active")) {
            view.activarDesactivarBoton(boton, false);
            storage.quitarPlatoFavorito(Number(obtenerId()), userMeal.userId);
            view.mostrarElement(formFavorito, false);
        }
        else {
            view.activarDesactivarBoton(boton, true);
            storage.guardarPlatoFavorito(userMeal, userMeal.userId);
            view.mostrarElement(formFavorito, true);
        }
    }
    catch (error) {
        console.log(error);
    }
}
function transformarMyMealAUserMeal(platoId) {
    const storage = new StorageService();
    const userId = storage.getUsuarioActual()?.id;
    if (!userId)
        throw new Error("El usuario no existe");
    return {
        userId: userId,
        mealId: platoId,
        saveDate: new Date(),
        status: Estado.QUIERO_HACERLA,
    };
}
function platoActualEnFavoritos(idMeal) {
    const storage = new StorageService();
    const userId = storage.getUsuarioActual()?.id;
    if (!userId)
        throw new Error("El usuario no existe");
    const platoActualFav = storage.buscarPlatoFavoritoPorId(idMeal, userId);
    if (platoActualFav) {
        return true;
    }
    else {
        return false;
    }
}
function cargarValidacionDeFormularios() {
    // TODO: revisar si hace falta o con la de app.ts basta
    (() => {
        const forms = document.querySelectorAll(".needs-validation");
        Array.from(forms).forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (form.checkValidity()) {
                    handleOpinionFormulario(form);
                    console.log("es valido");
                }
                else {
                    console.log("no valido");
                    form.classList.add("was-validated");
                }
            }, false);
        });
    })();
}
function handleOpinionFormulario(form) {
    const storage = new StorageService();
    const userMeal = transformarMyMealAUserMeal(Number(obtenerId()));
    userMeal.status = form.estado.value;
    userMeal.notes = form.opinion.value;
    userMeal.rating = 0; //TODO
    storage.actualizarPlatoFavorito(userMeal, userMeal.userId);
    form.classList.remove("was-validated");
}
//# sourceMappingURL=details.js.map