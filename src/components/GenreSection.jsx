import React from 'react';
import Card from './Card';

// Компонент отображает секцию жанров
// Принимает массив жанров
function GenreSection({ genres }) {
  if (!genres || genres.length === 0) return null; // Ничего не рендерим, если жанры не переданы

  return (
    <section className="section genres-section">
      <h2 className="section-title">Browse Genres</h2>
      <div className="genres-grid">
        {genres.map((genre, index) => (
          <Card
            key={genre.tag}        // Уникальный ключ для каждого жанра
            item={genre}
            type="genre"
            isLarge={index === 0}  // Только первая карточка будет увеличенной
          />
        ))}
      </div>
    </section>
  );
}

export default GenreSection;
