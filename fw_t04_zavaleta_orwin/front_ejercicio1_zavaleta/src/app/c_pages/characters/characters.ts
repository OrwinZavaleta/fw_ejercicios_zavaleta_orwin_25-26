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

  constructor() {
    this.charactersData = resource({
      // TODO: que cargue las paginas solo al inicio
      params: () => this.page(),
      loader: async () => {
        return this.api.getCharactersPaginated(this.page());
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
