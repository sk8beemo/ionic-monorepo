import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export type SupportedLanguage = 'ru' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'ru';
  private readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en'];
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    const savedLanguage = this.getSavedLanguage();
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    }
  }

  getCurrentLanguage(): SupportedLanguage {
    return (this.translocoService.getActiveLang() ||
      this.DEFAULT_LANGUAGE) as SupportedLanguage;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return [...this.SUPPORTED_LANGUAGES];
  }

  setLanguage(lang: SupportedLanguage): void {
    if (this.SUPPORTED_LANGUAGES.includes(lang)) {
      this.translocoService.setActiveLang(lang);
      this.saveLanguage(lang);
    } else {
      console.warn(`Language ${lang} is not supported`);
    }
  }

  toggleLanguage(): SupportedLanguage {
    const currentLang = this.getCurrentLanguage();
    const newLang: SupportedLanguage =
      currentLang === 'ru' ? 'en' : 'ru';
    this.setLanguage(newLang);
    return newLang;
  }

  private saveLanguage(lang: SupportedLanguage): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, lang);
      } catch (error) {
        console.warn('Failed to save language to localStorage', error);
      }
    }
  }

  private getSavedLanguage(): SupportedLanguage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved && this.SUPPORTED_LANGUAGES.includes(saved as SupportedLanguage)) {
          return saved as SupportedLanguage;
        }
      } catch (error) {
        console.warn('Failed to read language from localStorage', error);
      }
    }
    return null;
  }

  getLanguageName(lang: SupportedLanguage): string {
    const names: Record<SupportedLanguage, string> = {
      ru: 'Русский',
      en: 'English',
    };
    return names[lang] || lang;
  }
}
