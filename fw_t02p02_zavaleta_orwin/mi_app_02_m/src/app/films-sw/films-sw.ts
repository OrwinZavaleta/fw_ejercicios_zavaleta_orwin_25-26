import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ApiswService } from '../services/apisw.service';
import { IFilmSW } from '../interfaces/i-film-sw.interface';

import { IFilmRating } from '../interfaces/i-film-rating.interface';
import { LocalStorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-films-sw',
  standalone: false,
  templateUrl: './films-sw.html',
  styleUrl: './films-sw.css',
})
export class FilmsSW implements OnInit {
  public titleComp = 'FILM';

  private apiswService = inject(ApiswService);
  private cdr = inject(ChangeDetectorRef);
  private _filmsSW: IFilmSW[] = [];

  public loading = true;
  public error = '';

  private localStorageService = inject(LocalStorageService);

  // Control de checkboxes y ratings
  public filmRatings = new Map<number, number>();

  get filmsSW(): IFilmSW[] {
    return this._filmsSW;
  }

  set filmsSW(films: IFilmSW[]) {
    this._filmsSW = films;
  }

  removeFilmByEpisodeId(episodeId: number): void {
    this._filmsSW = this._filmsSW.filter((film) => film.episodeId !== episodeId);
    this.filmRatings.delete(episodeId);
    this.cdr.markForCheck(); //notifica a Angular un cambio.
  }

  async ngOnInit() {
    await this.loadFilms();
  }

  private loadSavedRatings(): void {
    const savedFilms = this.localStorageService.getFilms();

    savedFilms.forEach((saved) => {
      this.filmRatings.set(saved.episodeId, saved.rating);
    });

    this.cdr.markForCheck();
  }

  async loadFilms(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck(); //notifica a Angular un cambio.

    try {
      this._filmsSW = await this.apiswService.getFilms();
      this._filmsSW.sort((a, b) => a.episodeId - b.episodeId);
      this.loadSavedRatings();
    } catch {
      this.error = 'Error loading films';
    } finally {
      this.loading = false;
      this.cdr.markForCheck(); //notifica a Angular un cambio.
    }
  }

  onCheckboxChange(episodeId: number, check: boolean): void {
    if (check) {
      this.filmRatings.set(episodeId, 0);
    } else {
      this.filmRatings.delete(episodeId);
    }
    this.cdr.markForCheck();
  }

  onRatingChange(episodeId: number, inputRat: string): void {
    const rating = Number(inputRat);
    this.filmRatings.set(episodeId, rating);
    this.cdr.markForCheck();
  }

  isSelected(episodeId: number): boolean {
    return this.filmRatings.has(episodeId);
  }

  getRating(episodeId: number): number {
    return this.filmRatings.get(episodeId) || 0;
  }

  getSelectedFilmsWithRatings(): IFilmRating[] {
    const selected: IFilmRating[] = [];

    this.filmRatings.forEach((rating, episodeId) => {
      selected.push({ episodeId, rating });
    });

    return selected;
  }
  saveSelectedFilms(): void {
    const selectedFilms = this.getSelectedFilmsWithRatings();
    this.localStorageService.saveFilms(selectedFilms);
    alert(`Guardadas ${selectedFilms.length} películas en localStorage`);
  }
}
