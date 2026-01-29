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

    if (typeof sesion === "string") {
        document.querySelector("#menu-auth")?.classList.remove("d-none");
        document.querySelector("#menu-guest")?.classList.add("d-none");
    } else {
        document.querySelector("#menu-auth")?.classList.add("d-none");
        document.querySelector("#menu-guest")?.classList.remove("d-none");
    }
}

function cargarEventosLoginOut(): void {
    const storage = new StorageService();
    const view = new ViewService();
    document.querySelector("#logout")?.addEventListener("click", () => {
        storage.removeUsuarioActual();
        comprobarSesionUsuario();
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
                    }

                    form.classList.add("was-validated");
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
        } else {
            esValido &&= false;
            view.actualizarValidez(
                form.password,
                false,
                "La contraseña o el correo no es valido",
            );
        }
    } else if (form.id == "registroForm") {
        if (form.password.value === form.confirmPassword.value) {
            esValido &&= true;
        } else {
            esValido &&= false;
            view.actualizarValidez(
                form.password,
                false,
                "La contraseña no es valida",
            );
        }
    }
    return esValido;
}
