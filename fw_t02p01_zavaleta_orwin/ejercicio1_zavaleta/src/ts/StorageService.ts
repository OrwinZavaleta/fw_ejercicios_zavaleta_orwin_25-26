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
        localStorage.setItem("session", JSON.stringify(usuario));
    }

    public getUsuarioActual(): User | null {
        const usersinProcesar: string | null = localStorage.getItem("session");

        if (usersinProcesar === null) return null;
        return JSON.parse(usersinProcesar);
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
}
