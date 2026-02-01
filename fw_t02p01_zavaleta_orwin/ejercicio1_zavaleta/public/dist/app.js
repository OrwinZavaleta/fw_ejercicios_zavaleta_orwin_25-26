import { StorageService } from "./StorageService.js";
import { ViewService } from "./ViewService.js";
console.log("app.ts");
document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
    cargarEventosLoginOut();
    cargarValidacionDeFormularios();
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
function cargarEventosLoginOut() {
    const storage = new StorageService();
    const view = new ViewService();
    document.querySelector("#logout")?.addEventListener("click", () => {
        storage.removeUsuarioActual();
        comprobarSesionUsuario();
    });
    const btnLogin = document.querySelector("#login");
    btnLogin.addEventListener("click", function () {
        view.seleccionarTab(document.querySelector("#login-tab"));
    });
    const btnRegister = document.querySelector("#register");
    btnRegister.addEventListener("click", function () {
        view.seleccionarTab(document.querySelector("#register-tab"));
    });
}
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
                    comprobarSesionUsuario();
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
function crearUsuario(form) {
    const storage = new StorageService();
    const user = {
        id: storage.obtenerProximoIdUser(),
        name: form.usuario.value,
        email: form.correo.value,
        password: form.password.value,
    };
    form.classList.remove("was-validated");
    form.reset();
    storage.guardarAgregarUsuario(user);
    cerrarModalLoginOut();
}
function cerrarModalLoginOut() {
    const view = new ViewService();
    const modal = document.querySelector("#loginOut");
    view.ocultarModal(modal);
}
function iniciarSesion(form) {
    const storage = new StorageService();
    const usuarioActual = storage.buscarUsuarioPorCorreo(form.email.value);
    if (usuarioActual && usuarioActual.password === form.password.value) {
        storage.setUsuarioActual(usuarioActual);
        cerrarModalLoginOut();
        form.classList.remove("was-validated");
        form.reset();
    }
    else {
        console.log("usuario no existe");
    }
}
function realizarMiValidacion(form) {
    let esValido = true;
    const view = new ViewService();
    const storage = new StorageService();
    if (form.id == "loginForm") {
        const usuarioActual = storage.buscarUsuarioPorCorreo(form.email.value);
        if (usuarioActual && usuarioActual.password === form.password.value) {
            esValido && (esValido = true);
            view.actualizarValidez(form.password, true, "");
        }
        else {
            esValido && (esValido = false);
            view.actualizarValidez(form.password, false, "La contraseña o el correo no es valido");
        }
    }
    else if (form.id == "registroForm") {
        const usuarioActual = storage.buscarUsuarioPorCorreo(form.correo.value);
        if (usuarioActual) {
            esValido && (esValido = false);
            debugger;
            view.actualizarValidez(form.correo, false, "El usuario ingresado ya existe");
        }
        else {
            view.actualizarValidez(form.correo, true, "");
            if (form.password.value !== form.confirmPassword.value) {
                esValido && (esValido = false);
                view.actualizarValidez(form.password, false, "La contraseña no es valida");
            }
            else {
                esValido && (esValido = true);
                view.actualizarValidez(form.password, true, "");
            }
        }
    }
    else {
        esValido && (esValido = false);
    }
    return esValido;
}
//# sourceMappingURL=app.js.map