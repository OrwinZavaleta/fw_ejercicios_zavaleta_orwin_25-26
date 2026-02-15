import { Routes } from '@angular/router';
import { FlexGrid } from './c_pages/flex-grid/flex-grid';
import { Home } from './c_pages/home/home';
import { PrimerosPasos } from './c_pages/primeros-pasos/primeros-pasos';
import { ResponsiveStates } from './c_pages/responsive-states/responsive-states';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'primeros-pasos', component: PrimerosPasos },
  { path: 'flex-grid', component: FlexGrid },
  { path: 'responsive-states', component: ResponsiveStates },
];
