import { AuthSession } from "./AuthSession.js";
export class StorageService {
    constructor() {
        this.USER_KEY_ITEM = [];
        this.USER_MEAL_KEY_ITEM = "";
    }
    guardarAgregarUsuario(nuevoUsuario) {
        const users = JSON.parse(localStorage.getItem("users") ?? "[]");
        users.push(nuevoUsuario);
        localStorage.setItem("users", JSON.stringify(users));
        this.setUsuarioActual(nuevoUsuario);
    }
    setUsuarioActual(usuario) {
        const usuarioAGuardar = new AuthSession(usuario.id, usuario.name, new Date());
        localStorage.setItem("session", JSON.stringify(usuarioAGuardar));
    }
    getUsuarioActual() {
        const usersinProcesar = localStorage.getItem("session");
        if (usersinProcesar === null)
            return null;
        const usuarioProcesado = AuthSession.fromJSON(usersinProcesar);
        return this.buscarUsuarioPorId(usuarioProcesado.getId());
    }
    removeUsuarioActual() {
        localStorage.removeItem("session");
    }
    buscarUsuarioPorCorreo(correo) {
        const users = JSON.parse(localStorage.getItem("users") ?? "[]");
        const usuarioEncontrado = users.find((us) => us.email === correo);
        if (usuarioEncontrado === undefined)
            return null;
        return usuarioEncontrado;
    }
    buscarUsuarioPorId(id) {
        const users = JSON.parse(localStorage.getItem("users") ?? "[]");
        const usuarioEncontrado = users.find((us) => us.id === id);
        if (usuarioEncontrado === undefined)
            return null;
        return usuarioEncontrado;
    }
    actualizarDatosUsuario(usuario) {
        const users = JSON.parse(localStorage.getItem("users") ?? "[]");
        const usuarioEncontrado = users.find((us) => us.email === usuario.email);
        if (usuarioEncontrado) {
            usuarioEncontrado.favoriteCategory = usuario.favoriteCategory;
            localStorage.setItem("users", JSON.stringify(users));
        }
        else {
            throw new Error("El usuario no existe");
        }
    }
}
//# sourceMappingURL=StorageService.js.map