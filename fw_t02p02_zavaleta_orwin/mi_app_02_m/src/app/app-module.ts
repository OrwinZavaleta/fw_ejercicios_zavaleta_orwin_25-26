import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { User } from './user/user';
import { Child } from './child/child';
import { Comments } from './comments/comments';

import { NgOptimizedImage } from '@angular/common';
import { Home } from './home/home';

@NgModule({
  declarations: [
    App,
    User,
    Child,
    Comments,
    Home
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
