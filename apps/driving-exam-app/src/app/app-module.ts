import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';
import { App } from './app';
import { appRoutes } from './app.routes';
import { provideMonorepoI18n } from '@ionic-monorepo/i18n';
import { HomeComponent } from './pages/home/home.component';

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
    ...provideMonorepoI18n({
      appId: 'driving-exam-app',
      availableLangs: ['ru', 'en'],
      defaultLang: 'ru',
    }),
  ],
  bootstrap: [App],
})
export class AppModule {}
