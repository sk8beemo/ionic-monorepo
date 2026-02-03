import { EnvironmentProviders } from '@angular/core';
import {
  provideTransloco,
  provideTranslocoScope,
  TranslocoOptions,
} from '@jsverse/transloco';
import { TranslocoHttpLoaderService } from '../services/transloco-http-loader.service';

export interface MonorepoI18nConfig {
  /**
   * Идентификатор приложения (например 'scratch-master-app' или 'driving-exam-app')
   * Используется как scope для app-specific переводов
   */
  appId: string;
  /**
   * Доступные языки
   */
  availableLangs: string[];
  /**
   * Язык по умолчанию
   */
  defaultLang: string;
  /**
   * Алиас для scope приложения (по умолчанию 'app')
   * Используется в шаблонах: {{ 'app.menu.play' | transloco }}
   */
  appScopeAlias?: string;
  /**
   * Дополнительные опции Transloco
   */
  translocoOptions?: Partial<TranslocoOptions['config']>;
}

/**
 * Предоставляет полную конфигурацию Transloco для монорепозитория
 * с поддержкой общих переводов (global) и app-specific scope
 *
 * @example
 * ```typescript
 * providers: [
 *   provideMonorepoI18n({
 *     appId: 'scratch-master-app',
 *     availableLangs: ['ru', 'en'],
 *     defaultLang: 'ru',
 *   }),
 * ]
 * ```
 */
export function provideMonorepoI18n(
  config: MonorepoI18nConfig
): EnvironmentProviders[] {
  const { appId, availableLangs, defaultLang, appScopeAlias = 'app', translocoOptions } = config;

  return [
    provideTransloco({
      config: {
        availableLangs,
        defaultLang,
        reRenderOnLangChange: true,
        prodMode: false,
        ...translocoOptions,
      },
      loader: TranslocoHttpLoaderService,
    }),
    provideTranslocoScope({
      scope: appId,
      alias: appScopeAlias,
    }),
  ];
}
