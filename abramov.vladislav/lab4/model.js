export class Book {
  constructor(title, author, year, genre) {
    Object.assign(this, { title, author, year: +year, genre });
  }
}

export class Library {
  constructor(name, books = []) {
    this.name = name;
    this.books = books;
  }
  addBook(book) { this.books.push(book); }
  removeBook(title) {
    const i = this.books.findIndex(b => b.title === title);
    i >= 0 && this.books.splice(i, 1);
  }
  get booksCount() { return this.books.length; }
}

const group = (libs, key) => libs.reduce((m, lib) => {
  lib.books.forEach(b => (m[b[key]] ??= []).push({ ...b }));
  return m;
}, {});

export const groupBooksByGenre = libs => new Map(Object.entries(group(libs, 'genre')));
export const groupBooksByYear = libs => new Map(Object.entries(group(libs, 'year')));
export const getUniqueAuthors = libs => [...new Set(libs.flatMap(l => l.books.map(b => b.author)))];
export const getUniqueYears = libs => [...new Set(libs.flatMap(l => l.books.map(b => b.year)))].sort((a,b) => a-b);
export const getBooksByAuthor = (libs, author) => libs.flatMap(l => l.books.filter(b => b.author === author));
