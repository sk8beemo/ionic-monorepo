# Руководство по запуску приложений

В монорепозитории есть два Ionic + Angular приложения:

1. **scratch-master-app** (vinyl-scratch) - порт 4200
2. **driving-exam-app** - порт 4201

## Быстрый старт

### Запуск приложений в режиме разработки

```bash
# Запуск первого приложения (vinyl-scratch)
pnpm dev:vinyl
# или
pnpm dev

# Запуск второго приложения (driving-exam-app)
pnpm dev:exam
```

### Сборка приложений

```bash
# Сборка vinyl-scratch
pnpm build:vinyl
pnpm build:prod:vinyl

# Сборка driving-exam-app
pnpm build:exam
pnpm build:prod:exam
```

### Запуск обоих приложений параллельно

Оба приложения могут работать одновременно на разных портах:
- `scratch-master-app` → http://localhost:4200
- `driving-exam-app` → http://localhost:4201

## Capacitor команды

### Для vinyl-scratch (scratch-master-app)

```bash
# Добавить платформу
pnpm cap:add:ios
pnpm cap:add:android

# Синхронизация
pnpm cap:sync:ios
pnpm cap:sync:android

# Открыть в IDE
pnpm cap:open:ios
pnpm cap:open:android

# Сборка и запуск
pnpm build:ios:vinyl
pnpm build:android:vinyl
pnpm run:ios:vinyl
pnpm run:android:vinyl
```

### Для driving-exam-app

```bash
# Добавить платформу
pnpm cap:add:ios:exam
pnpm cap:add:android:exam

# Синхронизация
pnpm cap:sync:ios:exam
pnpm cap:sync:android:exam

# Открыть в IDE
pnpm cap:open:ios:exam
pnpm cap:open:android:exam

# Сборка и запуск
pnpm build:ios:exam
pnpm build:android:exam
pnpm run:ios:exam
pnpm run:android:exam
```

## Тестирование

```bash
# Тесты vinyl-scratch
pnpm test:vinyl

# Тесты driving-exam-app
pnpm test:exam

# Линтинг
pnpm lint:vinyl
pnpm lint:exam
```

## Структура проектов

```
apps/
├── scratch-master-app/     # Vinyl Scratch приложение
│   ├── src/
│   ├── capacitor.config.ts
│   └── project.json
│
└── driving-exam-app/       # Driving Exam приложение
    ├── src/
    ├── capacitor.config.ts
    └── project.json
```

## Примечания

- Оба приложения используют общую библиотеку `@ionic-monorepo/i18n` для интернационализации
- Capacitor конфигурации настроены с разными `appId` и `appName`
- Порты настроены автоматически (4200 и 4201)
