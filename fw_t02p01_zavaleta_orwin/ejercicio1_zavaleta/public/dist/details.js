import { ApiService } from "./ApiService.js";
import { ViewService } from "./ViewService.js";
console.log("details.ts");
document.addEventListener("DOMContentLoaded", () => {
    cargarDetallesPlato();
    comprobarSesionUsuarioDetalle();
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
    let sesion = localStorage.getItem("session");
    console.log(sesion);
    if (typeof sesion === "string") {
    }
    else {
    }
}
//# sourceMappingURL=details.js.map