export class ViewService {
    insertarTexto(element, mensaje) {
        element.textContent = mensaje;
    }
    insertarTextoFormato(element, mensaje) {
        element.innerHTML = mensaje;
    }
    apendizarTexto(element, mensaje) {
        element.textContent += mensaje;
    }
    apendizarTextoFormato(element, mensaje) {
        element.innerHTML += mensaje;
    }
    pintarCategorias() {
    }
}
//# sourceMappingURL=ViewService.js.map