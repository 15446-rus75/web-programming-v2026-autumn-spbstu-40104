import {Book, Library} from './model.js';

const KEY = 'libraryData',
  DELAY = 500;
let libs = [];

document.addEventListener('DOMContentLoaded', () => {
  load();
  renderAll();
  setup();
});

function load() {
  const d = localStorage.getItem(KEY);
  if (d) {
    try {
      const p = JSON.parse(d);
      libs = p.libraries.map((l) => {
        const lib = new Library(l.name);
        lib.books = l.books.map(
          (b) => new Book(b.title, b.author, b.year, b.genre),
        );
        return lib;
      });
    } catch {
      libs = defaults();
    }
  } else libs = defaults();
}

function defaults() {
  const l1 = new Library('Городская');
  l1.addBook(new Book('Война и мир', 'Толстой', 1869, 'Роман'));
  l1.addBook(new Book('Преступление', 'Достоевский', 1866, 'Роман'));
  const l2 = new Library('Университетская');
  l2.addBook(new Book('Гарри Поттер', 'Роулинг', 1997, 'Фэнтези'));
  l2.addBook(new Book('1984', 'Оруэлл', 1949, 'Антиутопия'));
  return [l1, l2];
}

function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      libraries: libs.map((l) => ({
        name: l.name,
        books: l.books.map((b) => ({
          title: b.title,
          author: b.author,
          year: b.year,
          genre: b.genre,
        })),
      })),
    }),
  );
}

function renderLibs() {
  const c = document.getElementById('libraries-container');
  c.innerHTML = '';
  if (!libs.length) {
    c.innerHTML = '<p class="empty-state">Нет библиотек</p>';
    return;
  }
  libs.forEach((lib, i) => {
    const d = document.createElement('div');
    d.className = 'library-card';
    d.innerHTML = `<h3>${lib.name}</h3><p>Книг: ${lib.booksCount}</p><button class="delete-btn">Удалить</button>`;
    c.appendChild(d);
    d.querySelector('.delete-btn').onclick = () =>
      asyncOp(() => libs.splice(i, 1));
  });
}

function renderBooks() {
  const c = document.querySelector('[data-testid="entity-list"]');
  c.innerHTML = '';
  const all = libs.flatMap((l) => l.books.map((b) => ({...b, lib: l.name})));
  if (!all.length) {
    c.innerHTML = '<p class="empty-state">Нет книг</p>';
    return;
  }
  all.forEach((b) => {
    const d = document.createElement('div');
    d.className = 'book-card';
    d.setAttribute('data-testid', 'entity-card');
    d.innerHTML = `<h4>${b.title}</h4><p><strong>Автор:</strong>${b.author}</p><p><strong>Год:</strong>${b.year}</p><p><strong>Жанр:</strong>${b.genre}</p><p><strong>Библиотека:</strong>${b.lib}</p><button class="delete-book-btn" data-testid="delete-entity">Удалить</button>`;
    c.appendChild(d);
    d.querySelector('.delete-book-btn').onclick = () => {
      const lib = libs.find((l) => l.name === b.lib);
      asyncOp(() => lib.removeBook(b.title));
    };
  });
}

function updateSelect() {
  const s = document.getElementById('library-select');
  const v = s.value;
  s.innerHTML = '<option value="">Выберите библиотеку</option>';
  libs.forEach((l) => {
    const o = document.createElement('option');
    o.value = l.name;
    o.textContent = l.name;
    s.appendChild(o);
  });
  if (v && libs.some((l) => l.name === v)) s.value = v;
}

function renderAll() {
  renderLibs();
  renderBooks();
  updateSelect();
}

function setup() {
  document.getElementById('book-form').onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const lib = libs.find((l) => l.name === f.get('librarySelect'));
    if (!lib) {
      alert('Выберите библиотеку');
      return;
    }
    asyncOp(() =>
      lib.addBook(
        new Book(
          f.get('title'),
          f.get('author'),
          f.get('year'),
          f.get('genre'),
        ),
      ),
    );
    e.target.reset();
  };
  document.getElementById('library-form').onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const n = f.get('libraryName');
    if (!n.trim()) {
      alert('Введите название');
      return;
    }
    asyncOp(() => libs.push(new Library(n)));
    e.target.reset();
  };
}

function asyncOp(fn) {
  return new Promise((r) =>
    setTimeout(() => {
      fn();
      save();
      renderAll();
      r();
    }, DELAY),
  );
}
