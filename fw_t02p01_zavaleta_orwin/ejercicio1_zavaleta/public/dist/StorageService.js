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
        localStorage.setItem("session", JSON.stringify(usuario));
    }
    getUsuarioActual() {
        const usersinProcesar = localStorage.getItem("session");
        if (usersinProcesar === null)
            return null;
        return JSON.parse(usersinProcesar);
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
}
//# sourceMappingURL=StorageService.js.map