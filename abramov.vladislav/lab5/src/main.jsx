import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const BOOKS = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    rating: 4.8,
    price: 750,
    description: 'Мистический роман о визите дьявола в Москву 1930-х годов.',
    emoji: '🌙',
    color: '#6c5ce7',
  },
  {
    id: 2,
    title: '1984',
    author: 'Джордж Оруэлл',
    rating: 4.6,
    price: 520,
    description: 'Антиутопия о тоталитарном обществе и Большом Брате.',
    emoji: '👁️',
    color: '#2c3e50',
  },
  {
    id: 3,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    rating: 4.7,
    price: 680,
    description: 'Психологический роман о преступлении и его последствиях.',
    emoji: '⚖️',
    color: '#c0392b',
  },
  {
    id: 4,
    title: 'Гарри Поттер и философский камень',
    author: 'Дж. К. Роулинг',
    rating: 4.9,
    price: 890,
    description: 'Начало истории о юном волшебнике и школе Хогвартс.',
    emoji: '⚡',
    color: '#e67e22',
  },
  {
    id: 5,
    title: 'Война и мир',
    author: 'Лев Толстой',
    rating: 4.5,
    price: 1200,
    description: 'Эпический роман о судьбах людей в эпоху наполеоновских войн.',
    emoji: '🕊️',
    color: '#27ae60',
  },
  {
    id: 6,
    title: 'Три товарища',
    author: 'Эрих Мария Ремарк',
    rating: 4.7,
    price: 710,
    description: 'Роман о дружбе, любви и жизни между двумя войнами.',
    emoji: '🍂',
    color: '#a0703c',
  },
];

const FIELD_LABELS = {
  title: 'Название',
  price: 'Цена',
  rating: 'Рейтинг',
};

function BookCard({book}) {
  const fullStars = Math.round(book.rating);
  return (
    <div className="book-card" data-testid="book-card">
      <div className="book-cover" style={{background: book.color}}>
        <span className="cover-emoji">{book.emoji}</span>
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <div className="book-author">{book.author}</div>
        <div className="book-rating">
          <span className="stars">
            {'★'.repeat(fullStars)}
            {'☆'.repeat(5 - fullStars)}
          </span>
          <span className="rating-number">{book.rating}</span>
        </div>
        <p className="book-description">{book.description}</p>
        <div className="book-price">{book.price} ₽</div>
      </div>
    </div>
  );
}

function App() {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const handleSortClick = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  const getSortedBooks = () => {
    if (!sortField || !sortOrder) {
      return BOOKS;
    }
    const sorted = [...BOOKS].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      let cmp;
      if (typeof aVal === 'string') {
        cmp = aVal.localeCompare(bVal, 'ru');
      } else {
        cmp = aVal - bVal;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return sorted;
  };

  const arrow = sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '';
  const directionText = sortField
    ? `${FIELD_LABELS[sortField]} ${arrow}`
    : 'не задана';
  const sortedBooks = getSortedBooks();

  const sortButtons = [
    {field: 'title', testId: 'sort-title', label: 'Название'},
    {field: 'price', testId: 'sort-price', label: 'Цена'},
    {field: 'rating', testId: 'sort-rating', label: 'Рейтинг'},
  ];

  return (
    <div className="container">
      <h1>Книжный магазин</h1>

      <div className="sort-panel">
        <span className="sort-label">Сортировать по:</span>
        {sortButtons.map(({field, testId, label}) => (
          <button
            key={field}
            data-testid={testId}
            type="button"
            className={`sort-btn ${sortField === field ? 'active' : ''}`}
            onClick={() => handleSortClick(field)}
          >
            {label}
            {sortField === field && sortOrder && (
              <span className="sort-arrow">
                {sortOrder === 'asc' ? ' ↑' : ' ↓'}
              </span>
            )}
          </button>
        ))}
        <div className="sort-direction" data-testid="sort-direction">
          Сортировка: {directionText}
        </div>
      </div>

      <div className="books-grid">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
