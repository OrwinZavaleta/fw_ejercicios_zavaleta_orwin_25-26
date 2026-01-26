import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { User } from './user/user';
import { Forms } from './forms/forms';

const routes: Routes = [
  { path: '', title: 'App Home', component: Home },
  { path: 'user', title: 'App User', component: User },
  { path: 'forms', title: 'App Form', component: Forms },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
