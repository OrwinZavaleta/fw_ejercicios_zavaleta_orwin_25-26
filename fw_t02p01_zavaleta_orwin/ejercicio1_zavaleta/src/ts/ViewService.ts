export class ViewService {
    public insertarTexto(element: HTMLElement, mensaje: string) {
        element.textContent = mensaje;
    }

    public insertarTextoFormato(element: HTMLElement, mensaje: string) {
        element.innerHTML = mensaje;
    }
    public apendizarTexto(element: HTMLElement, mensaje: string) {
        element.textContent += mensaje;
    }

    public apendizarTextoFormato(element: HTMLElement, mensaje: string) {
        element.innerHTML += mensaje;
    }
}
