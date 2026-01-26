import { AuthSession } from "./AuthSession.js";
import { User } from "./User.js";

export class StorageService {
    private USER_KEY_ITEM: User["id"][] = [];
    private USER_MEAL_KEY_ITEM: string = "";

    public guardarAgregarUsuario(nuevoUsuario: User) {
        const users: User[] = JSON.parse(localStorage.getItem("users") ?? "[]");

        users.push(nuevoUsuario);

        localStorage.setItem("users", JSON.stringify(users));
        this.setUsuarioActual(nuevoUsuario);
    }

    public setUsuarioActual(usuario: User): void {
        const usuarioAGuardar = new AuthSession(
            usuario.id,
            usuario.name,
            new Date(),
        );
        localStorage.setItem("session", JSON.stringify(usuarioAGuardar));
    }

    public getUsuarioActual(): User | null {
        const usersinProcesar: string | null = localStorage.getItem("session");

        if (usersinProcesar === null) return null;

        const usuarioProcesado: AuthSession =
            AuthSession.fromJSON(usersinProcesar);

        return this.buscarUsuarioPorId(usuarioProcesado.getId());
    }

    public removeUsuarioActual(): void {
        localStorage.removeItem("session");
    }

    public buscarUsuarioPorCorreo(correo: string) {
        const users: User[] = JSON.parse(localStorage.getItem("users") ?? "[]");

        const usuarioEncontrado = users.find((us) => us.email === correo);

        if (usuarioEncontrado === undefined) return null;

        return usuarioEncontrado;
    }

    private buscarUsuarioPorId(id: User["id"]) {
        const users: User[] = JSON.parse(localStorage.getItem("users") ?? "[]");

        const usuarioEncontrado = users.find((us) => us.id === id);

        if (usuarioEncontrado === undefined) return null;

        return usuarioEncontrado;
    }

    public actualizarDatosUsuario(usuario: User) {
        const users: User[] = JSON.parse(localStorage.getItem("users") ?? "[]");

        const usuarioEncontrado = users.find(
            (us) => us.email === usuario.email,
        );
        if (usuarioEncontrado) {
            usuarioEncontrado.favoriteCategory = usuario.favoriteCategory;
            localStorage.setItem("users", JSON.stringify(users));
        } else {
            throw new Error("El usuario no existe");
        }
    }
}
