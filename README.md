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

### Структура монорепозитория

```
ionic-monorepo/
├── ionic-app/                    # Основное Ionic Angular приложение
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/           # Страницы приложения
│   │   │   │   └── home/       # Пример домашней страницы
│   │   │   ├── app-module.ts   # Главный модуль приложения
│   │   │   ├── app.routes.ts   # Конфигурация роутинга
│   │   │   └── app.html        # Корневой компонент
│   │   ├── index.html          # HTML точка входа
│   │   ├── main.ts             # TypeScript точка входа
│   │   └── styles.scss         # Глобальные стили (включая Ionic)
│   ├── vite.config.mts         # Конфигурация Vite
│   ├── project.json            # NX конфигурация проекта
│   └── tsconfig.*.json         # TypeScript конфигурации
├── ionic-app-e2e/              # E2E тесты (Playwright)
├── nx.json                      # Конфигурация NX workspace
├── package.json                # Зависимости и скрипты
├── pnpm-workspace.yaml         # Конфигурация pnpm workspace
└── tsconfig.base.json          # Базовая TypeScript конфигурация
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

#### Шаг 3: Генерация Capacitor проекта

Используйте генератор Nx для правильной настройки Capacitor в монорепозитории:

```sh
nx generate @nxext/capacitor:configuration --project ionic-app
# или
pnpm run gen
```

Генератор создаст:
- `capacitor.config.ts` в папке `ionic-app/` (не в корне!)
- Правильную конфигурацию для монорепозитория
- Nx targets для работы с Capacitor

Опции генератора:
- `--appId` - ID приложения (по умолчанию: `io.ionic.starter`)
- `--appName` - Имя приложения
- `--webDir` - Директория собранных веб-ресурсов (автоматически определяется)

#### Шаг 4: Добавление нативных платформ

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

1. **Конфигурация находится в папке проекта**: `ionic-app/capacitor.config.ts` (не в корне!)
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
