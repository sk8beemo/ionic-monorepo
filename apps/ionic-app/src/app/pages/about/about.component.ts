import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@ionic-monorepo/i18n';
import { Subject, takeUntil, skip } from 'rxjs';

interface AboutData {
  title: string;
  gameName: string;
  version: string;
  status: string;
  description: string;
  concept: {
    title: string;
    items: string[];
  };
  gameplay: {
    title: string;
    sections: Array<{
      title: string;
      description: string;
    }>;
  };
  visualStyle: {
    title: string;
    description: string;
  };
}

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  public translocoService = inject(TranslocoService);
  public languageService = inject(LanguageService);
  private destroy$ = new Subject<void>();

  aboutData = signal<AboutData | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAboutData();
    
    // Subscribe to language changes (skip first emission to avoid double load)
    this.translocoService.langChanges$
      .pipe(
        skip(1), // Skip the initial emission
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadAboutData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAboutData(): void {
    // Prevent multiple simultaneous requests
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.get<{ ru: AboutData; en: AboutData }>('/assets/about.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const currentLang = this.languageService.getCurrentLanguage();
          this.aboutData.set(data[currentLang]);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading about data:', err);
          this.error.set('Failed to load about information');
          this.loading.set(false);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
