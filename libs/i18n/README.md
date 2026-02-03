# @ionic-monorepo/i18n

Библиотека локализации для монорепозитория Ionic Angular.

## Описание

Эта библиотека предоставляет сервисы и ресурсы для интернационализации (i18n) приложений в монорепозитории.

## Структура

```
libs/i18n/
├── src/
│   ├── lib/
│   │   ├── assets/
│   │   │   └── i18n/          # Файлы переводов (JSON)
│   │   └── services/          # Сервисы локализации
│   └── index.ts               # Public API
├── project.json
└── tsconfig.json
```

## Экспорты

### Сервисы

- `LanguageService` - управление языками приложения
- `TranslocoHttpLoaderService` - HTTP loader для загрузки переводов

### Типы

- `SupportedLanguage` - тип для поддерживаемых языков ('ru' | 'en')

## Использование

```typescript
import { LanguageService, TranslocoHttpLoaderService } from '@ionic-monorepo/i18n';

// В компоненте
export class MyComponent {
  languageService = inject(LanguageService);
  
  changeLanguage() {
    this.languageService.setLanguage('en');
  }
}
```

## Добавление нового языка

1. Создайте файл `libs/i18n/src/lib/assets/i18n/{lang}.json`
2. Обновите `SUPPORTED_LANGUAGES` в `LanguageService`
3. Обновите `availableLangs` в конфигурации Transloco

## Файлы переводов

Файлы переводов находятся в `libs/i18n/src/lib/assets/i18n/` и автоматически копируются в `dist/<app>/assets/i18n/` при сборке (например: `dist/scratch-master-app/assets/i18n/`, `dist/driving-exam-app/assets/i18n/`).
