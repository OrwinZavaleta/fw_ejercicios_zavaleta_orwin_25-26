import { Injectable } from '@angular/core';
import { IFilmSW } from '../interfaces/i-film-sw.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiswService {
  private readonly API_URL = 'https://swapi.dev/api/films/';

  private convertJsonToInterface(filmApi: Record<string, string>): IFilmSW {
    return {
      title: filmApi['title'],
      director: filmApi['director'],
      year: parseInt(filmApi['release_date'].split('-')[0]),
      episodeId: Number(filmApi['episode_id']),
      openingCrawl: filmApi['opening_crawl'],
    };
  }

  async getFilms(): Promise<IFilmSW[]> {
    try {
      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: Record<string, unknown> = await response.json();

      // La API devuelve las películas en data.results
      const filmsApi: Record<string, string>[] = data['results'] as Record<string, string>[];

      const films: IFilmSW[] = filmsApi.map((film: Record<string, string>) =>
        this.convertJsonToInterface(film),
      );

      return films;
    } catch (error) {
      console.error('Error fetching films:', error);
      return [];
    }
  }
}
