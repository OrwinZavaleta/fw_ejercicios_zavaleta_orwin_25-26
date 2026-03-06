import { episodeType } from './character';

export interface Episode {
  code: episodeType;
  title: string;
  summary: string;
  year: number;
  characters: string[];
}
