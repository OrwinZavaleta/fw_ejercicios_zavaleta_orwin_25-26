import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estado } from '../../model/user-meal';
import { StorageService } from '../../services/storage-service';
import { Util } from '../../model/util';

@Component({
  selector: 'app-details-save',
  imports: [FormsModule],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
})
export class DetailsSave { // TODO: cargar la informacion al momento de entrar
  private storage = inject(StorageService);
  id = input.required<number>();
  public submited = signal<boolean>(false);

  public platoFavorito = signal(false);

  public calificacion = signal<number | null>(null);
  public estado: Estado = Estado.QUIERO_HACERLA;
  public opinion: string = '';

  handleCalificacion(j: number) {
    console.log('click en el: ' + j);
    this.calificacion.set(j);
    this.submited.set(false);
  }

  handleChangeEstado() {
    this.calificacion.set(null);
    this.submited.set(false);
  }

  handleSubmit() {
    this.submited.set(true);
    if (this.estado === Estado.LA_HE_HECHO && !this.calificacion()) {
      return;
    }
    console.log(
      'Se envio el formulario \ncalificacion:' +
        this.calificacion() +
        ' \nestado:' +
        this.estado +
        ' \nopinion:' +
        this.opinion,
    );

    const idUser = this.storage.getUsuarioActual()?.id;
    if (!idUser) throw 'No sesion activa.';

    const plato = Util.transformarMyMealAUserMeal(this.id(), idUser);
    plato.status = this.estado;
    plato.rating = this.calificacion() ?? undefined;
    plato.notes = this.opinion.trim() === '' ? undefined : this.opinion.trim();

    this.storage.actualizarPlatoFavorito(plato);
  }
}
