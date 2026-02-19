import { Component, inject, input, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Estado } from '../../model/user-meal';
import { StorageService } from '../../services/storage-service';
import { Util } from '../../model/util';
import { NodeWithI18n } from '@angular/compiler';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details-save',
  imports: [FormsModule, DatePipe],
  templateUrl: './details-save.html',
  styleUrl: './details-save.css',
})
export class DetailsSave {
  private storage = inject(StorageService);
  id = input.required<number>();
  public saveDate = signal<Date | null>(null);
  public submited = signal<boolean>(false);

  public platoFavorito = signal(false);

  public calificacion = signal<number | null>(null);
  public estado: Estado = Estado.QUIERO_HACERLA;
  public opinion: string = '';

  ngOnInit() {
    const favorito = this.storage.buscarPlatoFavoritoPorId(this.id());
    if (!favorito) return;

    if (favorito.notes) this.opinion = favorito.notes;
    if (favorito.status) this.estado = favorito.status;
    if (favorito.rating) this.calificacion.set(favorito.rating);
    this.saveDate.set(favorito.saveDate);
  }

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
