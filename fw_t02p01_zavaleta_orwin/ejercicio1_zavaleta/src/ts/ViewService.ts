import { cargarPlatosHome } from "./home.js";
import { Category } from "./Category.js";
import { MyMeal } from "./MyMeal";
import { StorageService } from "./StorageService.js";

declare const bootstrap: any;

export class ViewService {
    public insertarTexto(element: HTMLElement, mensaje: string): void {
        element.textContent = mensaje;
    }

    public insertarTextoFormato(element: HTMLElement, mensaje: string): void {
        element.innerHTML = mensaje;
    }
    public apendizarTexto(element: HTMLElement, mensaje: string): void {
        element.textContent += mensaje;
    }

    public apendizarTextoFormato(element: HTMLElement, mensaje: string): void {
        element.innerHTML += mensaje;
    }

    public pintarPlatos(
        platos: MyMeal[],
        element: HTMLDivElement,
        CANTIDAD_PLATOS_ALEATORIAS: number,
        botonCategoria: HTMLButtonElement,
        buttonState: boolean,
    ): void {
        this.insertarTextoFormato(element, "");
        for (
            let i = 0;
            i < platos.length && i < CANTIDAD_PLATOS_ALEATORIAS;
            i++
        ) {
            const plato = platos[i];

            this.apendizarTextoFormato(
                element,
                `
                <a href="detalles.html?id=${plato.idMeal}" class="text-decoration-none text-reset col">
                    <div class="card">
                        <img src="${plato.strMealThumb}/small" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${plato.strMeal}</h5>
                            <p class="card-text">${plato.strCategory}</p>
                            <p class="card-text">${plato.strArea}</p>
                            <p class="card-text">${plato.strCategory}</p> 
                            <p class="card-text">${plato.ingredients.map(
                                (element, index) => {
                                    return (
                                        "Ingrediente " +
                                        index +
                                        ": " +
                                        element.name +
                                        "<br>"
                                    );
                                },
                            )}</p> 
                        </div>
                    </div>
                </a>
                `,
            );

            this.activarDesactivarBoton(botonCategoria, !buttonState);
        }
    }

    public pintarCategorias(
        categorias: Category[],
        select: HTMLSelectElement,
    ): void {
        const favorito = this.getFavUsuarioActual();
        if (select !== null) {
            this.insertarTextoFormato(
                select,
                "<option value=''>Todas las categorías</option>",
            );

            categorias.forEach((categoria) => {
                this.apendizarTextoFormato(
                    select,
                    `<option value="${categoria.strCategory}">${categoria.strCategory}</option>`,
                );
            });
        }

        if (favorito) {
            select.value = favorito;
            this.activarDesactivarBoton(
                document.querySelector("#fijarCategoria") as HTMLButtonElement,
                true,
            );
        }

        select.addEventListener("change", cargarPlatosHome);

        document
            .querySelector("#fijarCategoria")
            ?.addEventListener("click", () => this.fijarDesfijarCategoria()); // Se usa flecha para que no pierda el puntero this y este siga apuntando al objeto ViewService
    }

    private fijarDesfijarCategoria(): void {
        const storage = new StorageService();
        const usuarioActual = storage.getUsuarioActual();
        const boton = document.querySelector(
            "#fijarCategoria",
        ) as HTMLButtonElement;

        if (usuarioActual) {
            if (boton?.classList.contains("active")) {
                usuarioActual.favoriteCategory = undefined;
                this.activarDesactivarBoton(boton, false);
                storage.actualizarDatosUsuario(usuarioActual);
            } else {
                const categoriaAAsignar = (
                    document.querySelector("#categories") as HTMLSelectElement
                ).value;
                if (
                    categoriaAAsignar &&
                    categoriaAAsignar !== null &&
                    categoriaAAsignar !== undefined
                ) {
                    usuarioActual.favoriteCategory = categoriaAAsignar;
                    storage.actualizarDatosUsuario(usuarioActual);
                    this.activarDesactivarBoton(boton, true);
                }
            }
        }
    }

    private activarDesactivarBoton(
        button: HTMLButtonElement,
        active: boolean,
    ): void {
        if (active) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    }

    public actualizarValidez(
        element: HTMLInputElement,
        valido: boolean,
        mensaje: string,
    ) {
        const hermanoContenedorError = element.nextElementSibling;
        if (hermanoContenedorError instanceof HTMLElement) {
            this.insertarTexto(hermanoContenedorError, mensaje);
        }

        if (valido) {
            element.setCustomValidity("");
        } else {
            element.setCustomValidity("mensaje");
        }
    }

    private getFavUsuarioActual(): string | null {
        const storage = new StorageService();
        const usuarioActual = storage.getUsuarioActual();
        if (usuarioActual?.favoriteCategory) {
            return usuarioActual.favoriteCategory;
        } else {
            return null;
        }
    }
    public ocultarModal(modal: HTMLDivElement) {
        if (modal) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);

            modalInstance.hide();
        }
    }

    public seleccionarTab(tab: HTMLButtonElement) {
        const tabBoot = new bootstrap.Tab(tab);
        tabBoot.show();
    }

    public pintarVistaDetalleProducto(platoDetalle: MyMeal) {
        const imagenHTML = document.querySelector(
            "#imagenPlato",
        ) as HTMLImageElement;

        const nombreHTML = document.querySelector(
            "#nombrePlato",
        ) as HTMLHeadingElement;
        const ingredientesHTML = document.querySelector(
            "#ingredientes",
        ) as HTMLUListElement;

        imagenHTML.src = platoDetalle.strMealThumb + "/medium";
        imagenHTML.alt = platoDetalle.strMeal;

        this.insertarTexto(nombreHTML, platoDetalle.strMeal);

        platoDetalle.ingredients.forEach((ingrediente) => {
            this.apendizarTextoFormato(
                ingredientesHTML,
                `<li class="list-group-item">${ingrediente.measure} de ${ingrediente.name}</li>`,
            );
        });
    }
}
