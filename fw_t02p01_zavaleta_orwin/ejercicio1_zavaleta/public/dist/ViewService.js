import { cargarPlatosHome } from "./home.js";
import { StorageService } from "./StorageService.js";
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
    pintarPlatos(platos, element, CANTIDAD_PLATOS_ALEATORIAS, botonCategoria, buttonState) {
        this.insertarTextoFormato(element, "");
        for (let i = 0; i < platos.length && i < CANTIDAD_PLATOS_ALEATORIAS; i++) {
            const plato = platos[i];
            this.apendizarTextoFormato(element, `
                <a href="detalles.html?id=${plato.idMeal}" class="text-decoration-none text-reset col">
                    <div class="card">
                        <img src="${plato.strMealThumb}/small" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${plato.strMeal}</h5>
                            <p class="card-text">${plato.strCategory}</p>
                            <p class="card-text">${plato.strArea}</p>
                            <p class="card-text">${plato.strCategory}</p> 
                            <p class="card-text">${plato.ingredients.map((element, index) => {
                return ("Ingrediente " +
                    index +
                    ": " +
                    element.name +
                    "<br>");
            })}</p> 
                        </div>
                    </div>
                </a>
                `);
            this.activarDesactivarBoton(botonCategoria, !buttonState);
        }
    }
    pintarCategorias(categorias, select) {
        const favorito = this.getFavUsuarioActual();
        if (select !== null) {
            this.insertarTextoFormato(select, "<option value=''>Todas las categorías</option>");
            categorias.forEach((categoria) => {
                this.apendizarTextoFormato(select, `<option value="${categoria.strCategory}">${categoria.strCategory}</option>`);
            });
        }
        if (favorito) {
            select.value = favorito;
            this.activarDesactivarBoton(document.querySelector("#fijarCategoria"), true);
        }
        select.addEventListener("change", cargarPlatosHome);
        document
            .querySelector("#fijarCategoria")
            ?.addEventListener("click", () => this.fijarDesfijarCategoria()); // Se usa flecha para que no pierda el puntero this y este siga apuntando al objeto ViewService
    }
    fijarDesfijarCategoria() {
        const storage = new StorageService();
        const usuarioActual = storage.getUsuarioActual();
        const boton = document.querySelector("#fijarCategoria");
        if (usuarioActual) {
            if (boton?.classList.contains("active")) {
                usuarioActual.favoriteCategory = undefined;
                this.activarDesactivarBoton(boton, false);
                storage.actualizarDatosUsuario(usuarioActual);
            }
            else {
                const categoriaAAsignar = document.querySelector("#categories").value;
                if (categoriaAAsignar &&
                    categoriaAAsignar !== null &&
                    categoriaAAsignar !== undefined) {
                    usuarioActual.favoriteCategory = categoriaAAsignar;
                    storage.actualizarDatosUsuario(usuarioActual);
                    this.activarDesactivarBoton(boton, true);
                }
            }
        }
    }
    activarDesactivarBoton(button, active) {
        if (active) {
            button.classList.add("active");
        }
        else {
            button.classList.remove("active");
        }
    }
    actualizarValidez(element, valido, mensaje) {
        const hermanoContenedorError = element.nextElementSibling;
        if (hermanoContenedorError instanceof HTMLElement) {
            this.insertarTexto(hermanoContenedorError, mensaje);
        }
        if (valido) {
            element.setCustomValidity("");
        }
        else {
            element.setCustomValidity(mensaje);
        }
    }
    getFavUsuarioActual() {
        const storage = new StorageService();
        const usuarioActual = storage.getUsuarioActual();
        if (usuarioActual?.favoriteCategory) {
            return usuarioActual.favoriteCategory;
        }
        else {
            return null;
        }
    }
    ocultarModal(modal) {
        if (modal) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
            modalInstance.hide();
        }
    }
    seleccionarTab(tab) {
        const tabBoot = new bootstrap.Tab(tab);
        tabBoot.show();
    }
    pintarVistaDetalleProducto(platoDetalle) {
        const imagenHTML = document.querySelector("#imagenPlato");
        const nombreHTML = document.querySelector("#nombrePlato");
        const ingredientesHTML = document.querySelector("#ingredientes");
        imagenHTML.src = platoDetalle.strMealThumb + "/medium";
        imagenHTML.alt = platoDetalle.strMeal;
        this.insertarTexto(nombreHTML, platoDetalle.strMeal);
        platoDetalle.ingredients.forEach((ingrediente) => {
            this.apendizarTextoFormato(ingredientesHTML, `<li class="list-group-item">${ingrediente.measure} de ${ingrediente.name}</li>`);
        });
    }
}
//# sourceMappingURL=ViewService.js.map