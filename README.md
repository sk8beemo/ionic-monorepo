# Ionic Angular Monorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Ionic Angular приложение в монорепозитории NX с Vite и pnpm ✨.

## Архитектура проекта

### Технологический стек

- **NX 22.4** - Монорепозиторий и инструменты сборки
- **Ionic Angular 8.7** - UI фреймворк для мобильных приложений
- **Angular 21** - Основной фреймворк приложения
- **Vite 7** - Быстрый сборщик (через @analogjs/vite-plugin-angular)
- **pnpm** - Пакетный менеджер
- **TypeScript 5.9** - Типизированный JavaScript
- **Vitest** - Фреймворк для тестирования
- **Playwright** - E2E тестирование
- **Transloco (@jsverse/transloco)** - Локализация и интернационализация (i18n)

### Структура монорепозитория

```
ionic-monorepo/
├── libs/                        # Библиотеки монорепозитория
│   └── i18n/                   # Библиотека локализации
│       ├── src/
│       │   ├── lib/
│       │   │   ├── assets/    # Файлы переводов
│       │   │   │   └── i18n/  # JSON файлы для каждого языка
│       │   │   └── services/  # Сервисы локализации
│       │   └── index.ts       # Public API библиотеки
│       ├── project.json        # NX конфигурация библиотеки
│       └── tsconfig.*.json     # TypeScript конфигурации
├── apps/                       # Приложения монорепозитория
│   └── ionic-app/              # Основное Ionic Angular приложение
│       ├── src/
│       │   ├── app/
│       │   │   ├── pages/         # Страницы приложения
│       │   │   │   └── home/     # Пример домашней страницы
│       │   │   ├── app-module.ts # Главный модуль приложения
│       │   │   ├── app.routes.ts # Конфигурация роутинга
│       │   │   └── app.html      # Корневой компонент
│       │   ├── index.html         # HTML точка входа
│       │   ├── main.ts            # TypeScript точка входа
│       │   └── styles.scss        # Глобальные стили (включая Ionic)
│       ├── vite.config.mts         # Конфигурация Vite
│       ├── project.json            # NX конфигурация проекта
│       └── tsconfig.*.json         # TypeScript конфигурации
├── nx.json                      # Конфигурация NX workspace
├── package.json                # Зависимости и скрипты
├── pnpm-workspace.yaml          # Конфигурация pnpm workspace
└── tsconfig.base.json           # Базовая TypeScript конфигурация
```

### Система сборки

Проект использует **гибридный подход**:

1. **Для разработки и тестирования**: Vite через `@analogjs/vite-plugin-angular`
   - Быстрая пересборка (HMR)
   - Оптимизированная разработка

2. **Для production сборки**: Angular DevKit (`@angular-devkit/build-angular`)
   - Полная оптимизация Angular
   - Tree-shaking и минификация
   - AOT компиляция

### Конфигурация Ionic

- ✅ **IonicModule** подключен в `AppModule`
- ✅ **Ionic стили** импортированы в `styles.scss`
- ✅ **Ionic компоненты** доступны для использования
- ✅ **Capacitor готов к настройке** - используйте генератор `@nxext/capacitor:capacitor-project`

### Текущие возможности

✅ **Работает:**
- Веб-разработка и сборка
- Dev сервер с hot reload
- Production сборка для веба
- Unit тесты (Vitest)
- E2E тесты (Playwright)
- Линтинг (ESLint)
- **Локализация (i18n)** - поддержка множества языков через Transloco

✅ **Доступно после настройки:**
- Сборки под iOS/Android через Capacitor
- Нативные плагины и API
- Запуск на реальных устройствах и эмуляторах

## Быстрый старт

### Установка зависимостей
```sh
pnpm install
```

### Запуск dev сервера
```sh
pnpm dev
# или
nx serve ionic-app
```

Приложение будет доступно по адресу: http://localhost:4200

### Сборка для production
```sh
pnpm build:prod
# или
nx build ionic-app --configuration=production
```

### Тестирование
```sh
pnpm test
# или
nx test ionic-app
```

### Линтинг
```sh
pnpm lint
# или
nx lint ionic-app
```

## Мобильные сборки (iOS / Android) через Capacitor

### Предварительные требования

- **iOS**: macOS, Xcode, CocoaPods
- **Android**: Android Studio, Android SDK (и JDK)

### Настройка Capacitor в монорепозитории Nx

В монорепозитории Nx используется плагин `@nxext/capacitor`, который правильно интегрирует Capacitor с Nx.

#### Шаг 1: Установка зависимостей

```sh
pnpm install
```

Это установит все необходимые зависимости, включая `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`.

#### Шаг 2: Сборка проекта

Перед настройкой Capacitor необходимо собрать проект:

```sh
pnpm build:prod
# или
nx build ionic-app --configuration=production
```

#### Шаг 3: Добавление нативных платформ

После генерации добавьте поддержку iOS и Android:

```sh
# Добавить iOS
nx run ionic-app:cap --cmd="add ios"
# или
pnpm cap:add:ios

# Добавить Android
nx run ionic-app:cap --cmd="add android"
# или
pnpm cap:add:android
```

### Работа с мобильными платформами

#### Синхронизация после сборки

После изменений в веб-коде синхронизируйте с нативными проектами:

```sh
# Синхронизация iOS
nx run ionic-app:cap --cmd="sync ios"
# или
pnpm cap:sync:ios

# Синхронизация Android
nx run ionic-app:cap --cmd="sync android"
# или
pnpm cap:sync:android

# Или синхронизация всех платформ
nx run ionic-app:cap --cmd="sync"
# или
pnpm cap:sync
```

#### Открытие в IDE

```sh
# Открыть iOS проект в Xcode
nx run ionic-app:cap --cmd="open ios"
# или
pnpm cap:open:ios

# Открыть Android проект в Android Studio
nx run ionic-app:cap --cmd="open android"
# или
pnpm cap:open:android
```

#### Запуск на симуляторе/эмуляторе

```sh
# Запустить на iOS симуляторе
nx run ionic-app:cap --cmd="run ios"
# или
pnpm run:ios

# Запустить на Android эмуляторе
nx run ionic-app:cap --cmd="run android"
# или
pnpm run:android
```

### Важные замечания для монорепозитория

1. **Конфигурация находится в папке проекта**: `apps/ionic-app/capacitor.config.ts` (не в корне!)
2. **Используйте executor `cap`**: команды Capacitor выполняются через `nx run ionic-app:cap --cmd="<команда>"`
3. **Зависимости плагинов**: Capacitor плагины должны быть добавлены в `package.json` в корне монорепозитория
4. **Путь к сборке**: `webDir` автоматически указывает на `dist/ionic-app` благодаря генератору
5. **Все команды через executor**: `add`, `sync`, `open`, `run` - все выполняется через `cap` executor с параметром `cmd`

### Полезные команды

```sh
# Полная сборка и синхронизация для iOS
pnpm build:ios

# Полная сборка и синхронизация для Android
pnpm build:android

# Сборка, синхронизация и запуск iOS
pnpm run:ios

# Сборка, синхронизация и запуск Android
pnpm run:android

# Или через Nx напрямую
nx run ionic-app:cap --cmd="sync ios"
nx run ionic-app:cap --cmd="open android"
```

## Локализация (i18n) с Transloco

Проект использует **Transloco** для поддержки множества языков. Transloco - это современная, легковесная библиотека для локализации Angular приложений с поддержкой runtime переключения языков.

Локализация вынесена в отдельную библиотеку `@ionic-monorepo/i18n` в монорепозитории для переиспользования между проектами.

### Структура переводов

Файлы переводов находятся в библиотеке `libs/i18n/src/lib/assets/i18n/`:

```
libs/i18n/src/lib/assets/i18n/
├── ru.json    # Русский язык
└── en.json    # Английский язык
```

### Использование в компонентах

#### В шаблонах (HTML)

```html
<!-- Простое использование -->
<h1>{{ 'home.title' | transloco }}</h1>

<!-- С параметрами -->
<p>{{ 'welcome.message' | transloco: { name: userName } }}</p>

<!-- Структурная директива -->
<div *transloco="let t">
  <h1>{{ t('home.title') }}</h1>
</div>
```

#### В TypeScript компонентах

```typescript
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@ionic-monorepo/i18n';

export class MyComponent {
  constructor(
    private translocoService: TranslocoService,
    public languageService: LanguageService
  ) {}

  getTranslation(): string {
    return this.translocoService.translate('home.title');
  }

  changeLanguage(): void {
    this.languageService.setLanguage('en');
    // или
    this.languageService.toggleLanguage();
  }
}
```

### Управление языками

Используйте `LanguageService` для управления языками:

```typescript
import { LanguageService } from './services/language.service';

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

### Добавление нового языка

1. **Создайте файл перевода** в `libs/i18n/src/lib/assets/i18n/`:
   ```json
   // de.json (немецкий)
   {
     "common": {
       "welcome": "Willkommen"
     }
   }
   ```

2. **Обновите конфигурацию** в `app-module.ts`:
   ```typescript
   provideTransloco({
     config: {
       availableLangs: ['ru', 'en', 'de'], // Добавьте новый язык
       defaultLang: 'ru',
       // ...
     }
   })
   ```

3. **Обновите `LanguageService`** в `libs/i18n/src/lib/services/language.service.ts`:
   ```typescript
   private readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en', 'de'];
   ```

### Использование библиотеки i18n

Библиотека `@ionic-monorepo/i18n` экспортирует:
- `LanguageService` - сервис для управления языками
- `TranslocoHttpLoaderService` - HTTP loader для загрузки переводов
- `SupportedLanguage` - тип для поддерживаемых языков

Импортируйте из библиотеки:
```typescript
import { LanguageService, TranslocoHttpLoaderService } from '@ionic-monorepo/i18n';
```

### Особенности

- ✅ **Runtime переключение** - смена языка без перезагрузки приложения
- ✅ **Lazy loading** - переводы загружаются по требованию
- ✅ **TypeScript поддержка** - автодополнение и проверка типов
- ✅ **Сохранение выбора** - язык сохраняется в localStorage
- ✅ **Плюрализация** - поддержка множественных форм
- ✅ **Интерполяция** - вставка переменных в переводы

### Примеры использования

Смотрите реализацию в `HomeComponent` (`apps/ionic-app/src/app/pages/home/`) для примеров использования локализации.

[Learn more about Transloco &raquo;](https://jsverse.gitbook.io/transloco/)

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
