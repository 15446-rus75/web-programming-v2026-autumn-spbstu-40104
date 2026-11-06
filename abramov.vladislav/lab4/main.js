import {Book, Library} from './model.js';

const STORAGE_KEY = 'libraryData';
const ASYNC_DELAY = 500;

let libraries = [];

document.addEventListener('DOMContentLoaded', () => {
  load();
  renderAll();
  setup();
});

function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      libraries = parsed.libraries.map((lib) => {
        const library = new Library(lib.name);
        library.books = lib.books.map(
          (b) => new Book(b.title, b.author, b.year, b.genre),
        );
        return library;
      });
    } catch {
      libraries = getDefaults();
    }
  } else {
    libraries = getDefaults();
  }
}

function getDefaults() {
  const city = new Library('Городская библиотека');
  city.addBook(new Book('Война и мир', 'Лев Толстой', 1869, 'Роман'));
  city.addBook(
    new Book('Преступление и наказание', 'Фёдор Достоевский', 1866, 'Роман'),
  );

  const university = new Library('Университетская библиотека');
  university.addBook(
    new Book('Гарри Поттер', 'Дж. К. Роулинг', 1997, 'Фэнтези'),
  );
  university.addBook(new Book('1984', 'Джордж Оруэлл', 1949, 'Антиутопия'));

  return [city, university];
}

function save() {
  const data = {
    libraries: libraries.map((lib) => ({
      name: lib.name,
      books: lib.books.map((b) => ({
        title: b.title,
        author: b.author,
        year: b.year,
        genre: b.genre,
      })),
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderAll() {
  renderLibraries();
  updateLibrarySelect();
}

function renderLibraries() {
  const container = document.querySelector('[data-testid="entity-list"]');
  container.innerHTML = '';

  if (libraries.length === 0) {
    container.innerHTML =
      '<p class="empty-state">Нет библиотек. Добавьте первую!</p>';
    return;
  }

  libraries.forEach((library, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('data-testid', 'entity-card');

    const booksHtml = library.books
      .map(
        (book, bookIndex) => `
        <div class="book-item">
          <div>
            <strong>${book.title}</strong> — ${book.author} (${book.year}, ${book.genre})
          </div>
          <button class="delete-book-btn" data-library-index="${index}" data-book-index="${bookIndex}">
            Удалить книгу
          </button>
        </div>
      `,
      )
      .join('');

    card.innerHTML = `
      <h4>${library.name}</h4>
      <p><strong>Книг:</strong> ${library.booksCount}</p>
      <div class="books-inside">
        ${booksHtml || '<p class="empty-state">Нет книг</p>'}
      </div>
      <button class="delete-btn" data-testid="delete-entity" data-library-index="${index}">
        Удалить библиотеку
      </button>
    `;
    container.appendChild(card);

    card.querySelector('.delete-btn').addEventListener('click', () => {
      asyncOp(() => {
        libraries.splice(index, 1);
      });
    });

    card.querySelectorAll('.delete-book-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const libraryIndex = Number(btn.dataset.libraryIndex);
        const bookIndex = Number(btn.dataset.bookIndex);
        asyncOp(() => {
          const title = libraries[libraryIndex].books[bookIndex].title;
          libraries[libraryIndex].removeBook(title);
        });
      });
    });
  });
}

function updateLibrarySelect() {
  const select = document.getElementById('library-select');
  const currentValue = select.value;
  select.innerHTML = '<option value="">Выберите библиотеку</option>';

  libraries.forEach((library) => {
    const option = document.createElement('option');
    option.value = library.name;
    option.textContent = library.name;
    select.appendChild(option);
  });

  if (currentValue && libraries.some((lib) => lib.name === currentValue)) {
    select.value = currentValue;
  }
}

function setup() {
  const libraryForm = document.getElementById('library-form');
  libraryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    if (!name.trim()) {
      alert('Введите название библиотеки');
      return;
    }
    asyncOp(() => {
      libraries.push(new Library(name));
    });
    e.target.reset();
  });

  const bookForm = document.getElementById('book-form');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const libraryName = formData.get('librarySelect');
    const library = libraries.find((lib) => lib.name === libraryName);
    if (!library) {
      alert('Выберите библиотеку');
      return;
    }
    asyncOp(() => {
      library.addBook(
        new Book(
          formData.get('title'),
          formData.get('author'),
          formData.get('year'),
          formData.get('genre'),
        ),
      );
    });
    e.target.reset();
  });
}

function asyncOp(operation) {
  return new Promise((resolve) => {
    setTimeout(() => {
      operation();
      save();
      renderAll();
      resolve();
    }, ASYNC_DELAY);
  });
}
