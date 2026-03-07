import { Component, inject, resource, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-characters',
  imports: [],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters {
  private api = inject(ApiService);
  public charactersData;
  public page = signal(1);
  public npages = signal<number | null>(null);

  constructor() {
    this.charactersData = resource({
      params: () => this.page(),
      loader: async () => {
        const respuesta = await this.api.getCharactersPaginated(this.page());
        if (!this.npages()) this.npages.set(respuesta.pagination.totalPages);
        return respuesta;
      },
    });
  }

  public handleSetPage(page: number) {
    this.page.set(page);
  }
  public handleDecreasePage() {
    this.page.set(this.page() - 1);
  }
  public handleIncreasePage() {
    this.page.set(this.page() + 1);
  }
}
