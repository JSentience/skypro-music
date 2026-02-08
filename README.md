# Skypro Music

Веб‑приложение музыкального сервиса на Next.js (App Router) с авторизацией, плейлистами и избранным. Проект использует Redux Toolkit, Axios и UI‑улучшения (skeleton/loading, уведомления).

## Возможности

- Авторизация и регистрация
- Списки треков, подборки и избранное
- Фильтры по исполнителю/жанру/году и поиск
- Skeleton‑загрузка для треков и переходов между страницами
- Уведомления через `react-toastify`

## Технологии

- Next.js 16 (App Router)
- React 19
- TypeScript
- Redux Toolkit + React Redux
- Axios
- Jest + Testing Library
- ESLint

## Быстрый старт

1. Установить зависимости:

```bash
yarn
```

2. Запустить dev‑сервер:

```bash
yarn dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Скрипты

- `yarn dev` — запуск в dev‑режиме
- `yarn build` — сборка
- `yarn start` — запуск production‑сборки
- `yarn lint` — линтер
- `yarn test` — тесты

## API

Базовый URL API хранится в `src/sevices/constants.ts`.

## Уведомления (Toast)

Глобальный контейнер подключается в `src/app/layout.tsx` через `ToastProvider`. Для вызова:

```ts
import { notify } from '@/utils/notify';

notify.success('Готово!');
notify.error('Ошибка');
```

## Skeleton‑загрузка

Компонент `Loading` поддерживает режимы:

- `variant="tracks"` — список треков
- `variant="page"` — загрузка страницы

Используется в `src/components/Loading/Loading.tsx` и `src/app/loading.tsx`.

## Структура проекта

```
src/
	app/                # роуты и layout
	components/         # UI‑компоненты
	hooks/              # пользовательские хуки
	sevices/            # API/HTTP слой
	store/              # Redux store и слайсы
	utils/              # утилиты
	sharedTypes/        # общие типы
```

## Тесты

Тесты размещены рядом с компонентами (например, `Bar`, `Track`, `Centerblock`).

## Примечания

- Если планируется перенос API‑URL в переменные окружения, добавь `.env.local` и используй `NEXT_PUBLIC_API_URL`.
- Для единообразия ошибок можно расширить `notify` и перехватчики в `http.ts`.
