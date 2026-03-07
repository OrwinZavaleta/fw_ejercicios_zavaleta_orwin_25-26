import { Injectable } from '@angular/core';
import { Character } from '../model/character';
import { Episode } from '../model/episode';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:3000/api';
  private JWT_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjlhNzUxMGZhYTZlOWIxNGRmY2Q5MWFjIiwiaWF0IjoxNzcyNzk5MzU5LCJleHAiOjE3NzM0MDQxNTl9.FpZ1nf2vZRi4UC5Mi19qS0fzFgYSmgiPr8oksO9sDAs';

  public async getCharacters() {
    const data = await fetch(this.API_URL + '/characters', {
      headers: {
        Authorization: 'Bearer ' + this.JWT_TOKEN,
      },
    });

    const characters: { data: Character[]; total: string } = await data.json();

    return characters;
  }
  public async getCharactersPaginated(page: number) {
    const data = await fetch(this.API_URL + `/characters?page=${page}&limit=4`, {
      headers: {
        Authorization: 'Bearer ' + this.JWT_TOKEN,
      },
    });

    const characters: {
      data: Character[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    } = await data.json();

    return characters;
  }
  public async getEpisodes() {
    const data = await fetch(this.API_URL + '/episodes', {
      headers: {
        Authorization: 'Bearer ' + this.JWT_TOKEN,
      },
    });

    const episodes: { data: Episode[]; total: string } = await data.json();

    return episodes;
  }
}
