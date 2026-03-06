type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type episodeType = `S${Digit}${Digit}E${Digit}${Digit}`;

export interface Character {
  name: string;
  img: string;
  age: number;
  species: 'humano' | 'demonio' | 'otro';
  specialTraits: string[];
  role: string;
  firstAppearance: episodeType;
}
