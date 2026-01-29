"use strict";
console.log("app.ts");
document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
});
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
//# sourceMappingURL=app.js.map