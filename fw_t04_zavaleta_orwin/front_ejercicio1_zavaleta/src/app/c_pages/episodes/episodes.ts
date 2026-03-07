import { Component, inject, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { Episode } from '../../model/episode';

@Component({
  selector: 'app-episodes',
  imports: [],
  templateUrl: './episodes.html',
  styleUrl: './episodes.css',
})
export class Episodes {
  private api = inject(ApiService);

  public episodes;
  public showModal = signal(false);
  public episodioElegido = signal<Episode | null>(null);

  constructor() {
    this.episodes = resource({
      loader: async () => {
        return this.api.getEpisodes();
      },
    });
  }

  handleClickDetalle(code: Episode['code']) {
    console.log(code);
    const episodioElegido = this.episodes.value()?.data.find((e) => e.code === code);

    this.showModal.set(true);
    this.episodioElegido.set(episodioElegido || null);
  }

  handleCloseModal() {
    this.showModal.set(false);
    this.episodioElegido.set(null);
  }
}
