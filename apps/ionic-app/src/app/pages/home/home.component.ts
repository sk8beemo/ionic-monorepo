import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService, SupportedLanguage } from '@ionic-monorepo/i18n';
import { SegmentCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public translocoService = inject(TranslocoService);
  public languageService = inject(LanguageService);
  private router = inject(Router);

  onLanguageChange(event: Event): void {
    const customEvent = event as SegmentCustomEvent;
    const language = customEvent.detail.value as SupportedLanguage;
    if (language) {
      this.languageService.setLanguage(language);
    }
  }

  onPlayClick(): void {
    // TODO: Navigate to game screen
    console.log('Play clicked');
  }

  onAboutClick(): void {
    this.router.navigate(['/about']);
  }
}
