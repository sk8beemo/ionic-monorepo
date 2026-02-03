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
import { AboutComponent } from './pages/about/about.component';
import { TranslocoHttpLoaderService } from '@ionic-monorepo/i18n';
import { GameComponent } from './features/vinyl-scratch/game/game.component';
import { TurntableComponent } from './features/vinyl-scratch/game/components/turntable/turntable.component';

@NgModule({
  declarations: [App, HomeComponent, AboutComponent, GameComponent, TurntableComponent],
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
