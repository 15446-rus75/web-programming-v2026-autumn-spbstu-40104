export class Book {
  constructor(title, author, year, genre) {
    this.title = title;
    this.author = author;
    this.year = Number(year);
    this.genre = genre;
  }
}

export class Library {
  constructor(name) {
    this.name = name;
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
  }

  removeBook(title) {
    const index = this.books.findIndex((b) => b.title === title);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  }

  get booksCount() {
    return this.books.length;
  }
}

export function groupBooksByGenre(libraries) {
  const genreMap = new Map();
  for (const library of libraries) {
    for (const book of library.books) {
      if (!genreMap.has(book.genre)) {
        genreMap.set(book.genre, []);
      }
      genreMap.get(book.genre).push({...book});
    }
  }
  return genreMap;
}

export function getUniqueAuthors(libraries) {
  const authors = new Set();
  for (const library of libraries) {
    for (const book of library.books) {
      authors.add(book.author);
    }
  }
  return Array.from(authors);
}

export function groupBooksByYear(libraries) {
  const yearMap = new Map();
  for (const library of libraries) {
    for (const book of library.books) {
      if (!yearMap.has(book.year)) {
        yearMap.set(book.year, []);
      }
      yearMap.get(book.year).push({...book});
    }
  }
  return yearMap;
}

export function getUniqueYears(libraries) {
  const years = new Set();
  for (const library of libraries) {
    for (const book of library.books) {
      years.add(book.year);
    }
  }
  return Array.from(years).sort((a, b) => a - b);
}

export function findBooksByAuthor(libraries, author) {
  const result = [];
  for (const library of libraries) {
    for (const book of library.books) {
      if (book.author === author) {
        result.push({...book});
      }
    }
  }
  return result;
}
