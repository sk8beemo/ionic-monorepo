import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public translocoService = inject(TranslocoService);
  public languageService = inject(LanguageService);

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
