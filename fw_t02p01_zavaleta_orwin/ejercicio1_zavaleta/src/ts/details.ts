import { ApiService } from "./ApiService.js";
import { MyMeal } from "./MyMeal.js";
import { ViewService } from "./ViewService.js";

console.log("details.ts");

document.addEventListener("DOMContentLoaded", () => {
    cargarDetallesPlato();
    comprobarSesionUsuarioDetalle();
});

async function cargarDetallesPlato(): Promise<void> {
    const id: string = obtenerId();
    const view = new ViewService();
    const api = new ApiService();

    const plato:MyMeal =  await api.pedirPlatoPorId(Number(id));

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
    let sesion: string | null = localStorage.getItem("session");
    console.log(sesion);

    if (typeof sesion === "string") {
        
    } else {
    }
}