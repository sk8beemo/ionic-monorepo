import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  provideTransloco,
  TranslocoModule,
} from '@jsverse/transloco';
import { App } from './app';
import { appRoutes } from './app.routes';
import { HomeComponent } from './pages/home/home.component';
import { TranslocoHttpLoaderService } from '@ionic-monorepo/i18n';

@NgModule({
  declarations: [App, HomeComponent],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    TranslocoModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['ru', 'en'],
        defaultLang: 'ru',
        reRenderOnLangChange: true,
        prodMode: false,
      },
      loader: TranslocoHttpLoaderService,
    }),
  ],
  bootstrap: [App],
})
export class AppModule {}
