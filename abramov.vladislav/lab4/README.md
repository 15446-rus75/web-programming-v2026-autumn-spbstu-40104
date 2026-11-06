# Лабораторная работа 4

## Задание

Класс `Library` с полями `name` и `books` (массив книг с полями `title`,
`author`, `year`, `genre`).

Методы:

- `addBook(book)` — добавление книги;
- `removeBook(title)` — удаление по названию;
- геттер `booksCount` — количество книг.

5 функций для коллекции библиотек:

1. Группировка по жанру (`Map`).
2. Уникальные авторы.
3. Группировка по году.
4. Уникальные годы.
5. Книги автора.

UI с карточками книг, формами добавления, управлением библиотеками.
Асинхронность через `Promise` + `setTimeout`. Сохранение в `localStorage`.

## Реализация

Разделение модели и представления:

- `model.js` — классы `Book`, `Library` и 5 функций работы с коллекцией;
- `main.js` — логика UI, рендеринг, асинхронные операции, `localStorage`;
- `index.html` — разметка с `data-testid` (`entity-list`, `entity-form`,
  `entity-card`, `delete-entity`);
- `styles.css` — стили (Flexbox, Grid).

Поля формы: `title`, `author`, `year`, `genre`, `librarySelect`.

## Запуск

ES-модули требуют HTTP-сервер.

    cd lab4
    python3 -m http.server 8000

Открыть `http://localhost:8000`.
