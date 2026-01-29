import { AuthSession } from "./AuthSession.js";
import { User } from "./User.js";

export class StorageService {
    private USER_KEY_ITEM: string = "users";
    private AUTH_SESSION_KEY_ITEM: string = "session";
    private USER_MEAL_KEY_ITEM: string = "";

    public guardarAgregarUsuario(nuevoUsuario: User) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        users.push(nuevoUsuario);

        localStorage.setItem(this.USER_KEY_ITEM, JSON.stringify(users));
        this.setUsuarioActual(nuevoUsuario);
    }

    public setUsuarioActual(usuario: User): void {
        const usuarioAGuardar = new AuthSession(
            usuario.id,
            usuario.name,
            new Date(),
        );
        localStorage.setItem(
            this.AUTH_SESSION_KEY_ITEM,
            JSON.stringify(usuarioAGuardar),
        );
    }

    public getUsuarioActual(): User | null {
        const usersinProcesar: string | null = localStorage.getItem(
            this.AUTH_SESSION_KEY_ITEM,
        );

        if (usersinProcesar === null) return null;

        const usuarioProcesado: AuthSession =
            AuthSession.fromJSON(usersinProcesar);

        return this.buscarUsuarioPorId(usuarioProcesado.getId());
    }

    public removeUsuarioActual(): void {
        localStorage.removeItem(this.AUTH_SESSION_KEY_ITEM);
    }

    public buscarUsuarioPorCorreo(correo: string) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        const usuarioEncontrado = users.find((us) => us.email === correo);

        if (usuarioEncontrado === undefined) return null;

        return usuarioEncontrado;
    }

    private buscarUsuarioPorId(id: User["id"]) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        const usuarioEncontrado = users.find((us) => us.id === id);

        if (usuarioEncontrado === undefined) return null;

        return usuarioEncontrado;
    }

    public actualizarDatosUsuario(usuario: User) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        const usuarioEncontrado = users.find(
            (us) => us.email === usuario.email,
        );
        if (usuarioEncontrado) {
            usuarioEncontrado.favoriteCategory = usuario.favoriteCategory;
            localStorage.setItem(this.USER_KEY_ITEM, JSON.stringify(users));
        } else {
            throw new Error("El usuario no existe");
        }
    }

    public obtenerProximoIdUser(): User["id"] {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        let ultimoId = 0;

        users.forEach((us) => {
            if (us.id > ultimoId) ultimoId = us.id;
        });

        return ultimoId + 1;
    }
}
