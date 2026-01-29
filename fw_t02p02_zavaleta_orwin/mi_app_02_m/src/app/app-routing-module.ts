import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { User } from './user/user';
import { Forms } from './forms/forms';
import { Cars } from './cars/cars';
import { FilmsSW } from './films-sw/films-sw';

const routes: Routes = [
  { path: '', title: 'App Home', component: Home },
  { path: 'user', title: 'App User', component: User },
  { path: 'forms', title: 'App Form', component: Forms },
  { path: 'cars', title: 'App Cars', component: Cars },
  { path: 'films', title: 'App Films', component: FilmsSW },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
