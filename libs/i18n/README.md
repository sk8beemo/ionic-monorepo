# @ionic-monorepo/i18n

Библиотека локализации для монорепозитория Ionic Angular.

## Описание

Эта библиотека предоставляет сервисы, провайдеры и ресурсы для интернационализации (i18n) приложений в монорепозитории с поддержкой общих переводов и app-specific scope'ов.

## Структура

```
libs/i18n/
├── src/
│   ├── lib/
│   │   ├── assets/
│   │   │   └── i18n/          # Глобальные файлы переводов (общие для всех приложений)
│   │   ├── providers/         # Провайдеры для настройки Transloco
│   │   └── services/          # Сервисы локализации
│   └── index.ts               # Public API
├── project.json
└── tsconfig.json
```

## Архитектура переводов

Переводы организованы в два уровня:

1. **Глобальные переводы** (`libs/i18n/src/lib/assets/i18n/`) - общие для всех приложений
   - Содержат только действительно общие ключи: `common.*`, `language.*`
   - Пример: `common.loading`, `language.russian`

2. **App-specific scope** (`apps/<app-id>/public/assets/i18n/<app-id>/`) - переводы конкретного приложения
   - Содержат специфичные для приложения ключи
   - Используются через алиас `app` в шаблонах: `app.menu.play`, `app.home.title`
   - Загружаются лениво по требованию

## Экспорты

### Провайдеры

- `provideMonorepoI18n(config)` - основной провайдер для настройки Transloco с поддержкой scope'ов

### Сервисы

- `LanguageService` - управление языками приложения
- `TranslocoHttpLoaderService` - HTTP loader для загрузки переводов

### Типы

- `SupportedLanguage` - тип для поддерживаемых языков ('ru' | 'en')
- `MonorepoI18nConfig` - конфигурация для `provideMonorepoI18n`

## Использование

### Настройка в AppModule

```typescript
import { provideMonorepoI18n } from '@ionic-monorepo/i18n';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  imports: [TranslocoModule],
  providers: [
    provideHttpClient(),
    ...provideMonorepoI18n({
      appId: 'scratch-master-app',  // или 'driving-exam-app'
      availableLangs: ['ru', 'en'],
      defaultLang: 'ru',
    }),
  ],
})
export class AppModule {}
```

### Использование в компонентах

#### В шаблонах (HTML)

```html
<!-- Глобальные переводы (без префикса) -->
<p>{{ 'common.loading' | transloco }}</p>
<p>{{ 'language.russian' | transloco }}</p>

<!-- App-specific переводы (с префиксом app) -->
<h1>{{ 'app.home.title' | transloco }}</h1>
<button>{{ 'app.menu.play' | transloco }}</button>

<!-- С параметрами -->
<p>{{ 'welcome.message' | transloco: { name: userName } }}</p>

<!-- Структурная директива -->
<div *transloco="let t">
  <h1>{{ t('app.home.title') }}</h1>
</div>
```

#### В TypeScript компонентах

```typescript
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@ionic-monorepo/i18n';

export class MyComponent {
  translocoService = inject(TranslocoService);
  languageService = inject(LanguageService);
  
  getTranslation(): string {
    // Глобальный ключ
    return this.translocoService.translate('common.loading');
    
    // App-specific ключ
    return this.translocoService.translate('app.home.title');
  }
  
  changeLanguage(): void {
    this.languageService.setLanguage('en');
  }
}
```

### Управление языками

```typescript
import { LanguageService } from '@ionic-monorepo/i18n';

// Получить текущий язык
const currentLang = languageService.getCurrentLanguage(); // 'ru' | 'en'

// Установить язык
languageService.setLanguage('en');

// Переключить язык
languageService.toggleLanguage();

// Получить список поддерживаемых языков
const languages = languageService.getSupportedLanguages();

// Получить название языка
const name = languageService.getLanguageName('ru'); // 'Русский'
```

## Добавление переводов

### Добавление глобальных переводов

1. Откройте файл `libs/i18n/src/lib/assets/i18n/{lang}.json`
2. Добавьте ключ в секцию `common` или создайте новую секцию:

```json
{
  "common": {
    "newKey": "Новое значение"
  },
  "newSection": {
    "key": "Значение"
  }
}
```

### Добавление app-specific переводов

1. Откройте файл `apps/<app-id>/public/assets/i18n/<app-id>/{lang}.json`
2. Добавьте ключи:

```json
{
  "home": {
    "newTitle": "Новый заголовок"
  }
}
```

3. Используйте в шаблонах с префиксом `app`:

```html
<h1>{{ 'app.home.newTitle' | transloco }}</h1>
```

### Добавление нового языка

1. **Создайте файлы переводов**:
   - `libs/i18n/src/lib/assets/i18n/{lang}.json` (глобальные)
   - `apps/<app-id>/public/assets/i18n/<app-id>/{lang}.json` (для каждого приложения)

2. **Обновите конфигурацию** в `app-module.ts`:
   ```typescript
   ...provideMonorepoI18n({
     appId: 'scratch-master-app',
     availableLangs: ['ru', 'en', 'de'], // Добавьте новый язык
     defaultLang: 'ru',
   }),
   ```

3. **Обновите `LanguageService`** в `libs/i18n/src/lib/services/language.service.ts`:
   ```typescript
   private readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en', 'de'];
   ```

## Валидация переводов

Запустите проверку синхронизации ключей между языками:

```bash
pnpm i18n:check
```

Скрипт проверяет:
- Синхронизацию ключей между `ru.json` и `en.json` для глобальных переводов
- Синхронизацию ключей для каждого app-specific scope

## Особенности

- ✅ **Runtime переключение** - смена языка без перезагрузки приложения
- ✅ **Lazy loading scope'ов** - app-specific переводы загружаются по требованию
- ✅ **Разделение переводов** - каждое приложение не тащит чужие тексты
- ✅ **TypeScript поддержка** - автодополнение и проверка типов
- ✅ **Сохранение выбора** - язык сохраняется в localStorage
- ✅ **Плюрализация** - поддержка множественных форм
- ✅ **Интерполяция** - вставка переменных в переводы

## Структура файлов переводов

```
libs/i18n/src/lib/assets/i18n/
├── ru.json    # Глобальные переводы (русский)
└── en.json    # Глобальные переводы (английский)

apps/scratch-master-app/public/assets/i18n/scratch-master-app/
├── ru.json    # Переводы приложения (русский)
└── en.json    # Переводы приложения (английский)

apps/driving-exam-app/public/assets/i18n/driving-exam-app/
├── ru.json    # Переводы приложения (русский)
└── en.json    # Переводы приложения (английский)
```

[Learn more about Transloco &raquo;](https://jsverse.gitbook.io/transloco/)
