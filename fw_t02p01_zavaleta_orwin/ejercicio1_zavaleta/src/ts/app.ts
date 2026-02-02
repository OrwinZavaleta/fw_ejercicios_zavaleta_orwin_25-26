import { StorageService } from "./StorageService.js";
import { User } from "./User.js";
import { ViewService } from "./ViewService.js";

console.log("app.ts");

document.addEventListener("DOMContentLoaded", () => {
    comprobarSesionUsuario();
    cargarEventosLoginOut();
    cargarValidacionDeFormularios();
});

function comprobarSesionUsuario(): void {
    let sesion: string | null = localStorage.getItem("session");
    console.log(sesion);
    const storage = new StorageService();
    const view = new ViewService();

    if (storage.getUsuarioActual()) {
        view.mostrarElement(
            document.querySelector("#menu-auth") as HTMLDivElement,
            true,
        );
        view.mostrarElement(
            document.querySelector("#menu-guest") as HTMLDivElement,
            false,
        );
    } else {
        view.mostrarElement(
            document.querySelector("#menu-auth") as HTMLDivElement,
            false,
        );
        view.mostrarElement(
            document.querySelector("#menu-guest") as HTMLDivElement,
            true,
        );
    }
}

function cargarEventosLoginOut(): void {
    const storage = new StorageService();
    const view = new ViewService();
    document.querySelector("#logout")?.addEventListener("click", () => {
        storage.removeUsuarioActual();
        comprobarSesionUsuario();
        // window.location.href = window.location.href;
        window.location.reload()
    });

    const btnLogin = document.querySelector("#login") as HTMLLinkElement;
    btnLogin.addEventListener("click", function () {
        view.seleccionarTab(
            document.querySelector("#login-tab") as HTMLButtonElement,
        );
    });
    const btnRegister = document.querySelector("#register") as HTMLLinkElement;
    btnRegister.addEventListener("click", function () {
        view.seleccionarTab(
            document.querySelector("#register-tab") as HTMLButtonElement,
        );
    });
}

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
                        comprobarSesionUsuario();
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

function crearUsuario(form: HTMLFormElement) {
    const storage: StorageService = new StorageService();
    const user: User = {
        id: storage.obtenerProximoIdUser(),
        name: form.usuario.value,
        email: form.correo.value,
        password: form.password.value,
    };
    form.classList.remove("was-validated");
    form.reset();
    storage.guardarAgregarUsuario(user);
    cerrarModalLoginOut();
    // window.location.href = window.location.href;
    window.location.reload()
}

function cerrarModalLoginOut() {
    const view = new ViewService();
    const modal = document.querySelector("#loginOut") as HTMLDivElement;
    view.ocultarModal(modal);
}

function iniciarSesion(form: HTMLFormElement) {
    const storage: StorageService = new StorageService();
    const usuarioActual: User | null = storage.buscarUsuarioPorCorreo(
        form.email.value,
    );
    if (usuarioActual && usuarioActual.password === form.password.value) {
        storage.setUsuarioActual(usuarioActual);
        cerrarModalLoginOut();
        form.classList.remove("was-validated");
        form.reset();
    } else {
        console.log("usuario no existe");
    }

    // window.location.href = window.location.href;
    window.location.reload()
}

function realizarMiValidacion(form: HTMLFormElement): boolean {
    let esValido: boolean = true;

    const view = new ViewService();
    const storage: StorageService = new StorageService();

    if (form.id == "loginForm") {
        const usuarioActual: User | null = storage.buscarUsuarioPorCorreo(
            form.email.value,
        );
        if (usuarioActual && usuarioActual.password === form.password.value) {
            esValido &&= true;
            view.actualizarValidez(form.password, true, "");
        } else {
            esValido &&= false;
            view.actualizarValidez(
                form.password,
                false,
                "La contraseña o el correo no es valido",
            );
        }
    } else if (form.id == "registroForm") {
        const usuarioActual: User | null = storage.buscarUsuarioPorCorreo(
            form.correo.value,
        );

        if (usuarioActual) {
            esValido &&= false;
            debugger;
            view.actualizarValidez(
                form.correo,
                false,
                "El usuario ingresado ya existe",
            );
        } else {
            view.actualizarValidez(form.correo, true, "");
            if (form.password.value !== form.confirmPassword.value) {
                esValido &&= false;
                view.actualizarValidez(
                    form.password,
                    false,
                    "La contraseña no es valida",
                );
            } else {
                esValido &&= true;
                view.actualizarValidez(form.password, true, "");
            }
        }
    } else {
        esValido &&= false;
    }
    return esValido;
}
