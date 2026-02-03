# Scratch Master App

Ionic + Angular приложение в монорепозитории Nx.

## Запуск

```bash
# dev server (порт 4200)
pnpm dev:vinyl
# или
nx serve scratch-master-app
```

## Сборка

```bash
pnpm build:prod:vinyl
# или
nx build scratch-master-app --configuration=production
```

## Capacitor

```bash
pnpm cap:add:ios
pnpm cap:add:android

pnpm build:ios:vinyl
pnpm build:android:vinyl
```

## Игровая фича Vinyl Scratch

Документация по механикам игры находится в:
`src/app/features/vinyl-scratch/game/README.md`

