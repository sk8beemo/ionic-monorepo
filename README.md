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
- ⚠️ **Capacitor НЕ настроен** - мобильные сборки (iOS/Android) пока недоступны

### Текущие возможности

✅ **Работает:**
- Веб-разработка и сборка
- Dev сервер с hot reload
- Production сборка для веба
- Unit тесты (Vitest)
- E2E тесты (Playwright)
- Линтинг (ESLint)

⚠️ **Требует настройки:**
- Capacitor для мобильных платформ (iOS/Android)
- Нативные плагины и API
- Сборка под мобильные устройства

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

## ⚠️ Важная информация о Capacitor

### Текущее состояние

**Ionic подключен и работает**, но **Capacitor не настроен**. Это означает:

✅ **Что работает:**
- Веб-версия приложения полностью функциональна
- Все Ionic компоненты доступны и работают в браузере
- Можно разрабатывать и тестировать UI/UX в браузере
- Production сборка для веб-деплоя

❌ **Что НЕ работает:**
- Сборка под iOS (`npx cap add ios`)
- Сборка под Android (`npx cap add android`)
- Доступ к нативным API (камера, геолокация, push-уведомления и т.д.)
- Запуск на реальных устройствах или эмуляторах
- Публикация в App Store / Google Play

### Что нужно для настройки Capacitor

Для включения мобильных сборок потребуется:

1. **Установить Capacitor зависимости:**
   ```sh
   pnpm add @capacitor/core @capacitor/cli
   pnpm add -D @capacitor/ios @capacitor/android
   ```

2. **Создать `capacitor.config.ts`** в корне проекта с настройками:
   ```typescript
   import { CapacitorConfig } from '@capacitor/cli';
   
   const config: CapacitorConfig = {
     appId: 'com.example.ionicapp',
     appName: 'Ionic App',
     webDir: 'dist/ionic-app',
     server: {
       androidScheme: 'https'
     }
   };
   
   export default config;
   ```

3. **Инициализировать платформы:**
   ```sh
   npx cap add ios
   npx cap add android
   ```

4. **Настроить NX задачи** для синхронизации с Capacitor после сборки:
   - Добавить задачу `sync` в `project.json`
   - Настроить автоматическую синхронизацию после `build`

5. **Установить нативные зависимости:**
   - Для iOS: Xcode и CocoaPods (`pod install` в `ios/`)
   - Для Android: Android Studio и Android SDK

### Рекомендации

Если планируется разработка мобильного приложения, рекомендуется настроить Capacitor на раннем этапе, чтобы:
- Проверять работу на реальных устройствах
- Тестировать нативные плагины
- Обеспечить корректную работу на мобильных платформах
- Выявлять проблемы совместимости заранее

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
