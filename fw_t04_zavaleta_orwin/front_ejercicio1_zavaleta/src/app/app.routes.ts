import { Routes } from '@angular/router';
import { Layout } from './c_layout/layout/layout';
import { Home } from './c_pages/home/home';
import { Characters } from './c_pages/characters/characters';
import { Episodes } from './c_pages/episodes/episodes';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'characters', component: Characters },
      { path: 'episodes', component: Episodes },
    ],
  },
];
