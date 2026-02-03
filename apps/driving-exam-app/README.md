# Driving Exam App

Ionic + Angular приложение для тренировки экзамена на права (теория).

## Запуск

```bash
# dev server (порт 4201)
pnpm dev:exam
# или
nx serve driving-exam-app
```

## Сборка

```bash
pnpm build:prod:exam
# или
nx build driving-exam-app --configuration=production
```

## Capacitor

```bash
pnpm cap:add:ios:exam
pnpm cap:add:android:exam

pnpm build:ios:exam
pnpm build:android:exam
```

