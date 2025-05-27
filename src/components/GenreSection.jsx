import React from 'react';
import Card from './Card';

function GenreSection({ genres }) {
  if (!genres || genres.length === 0) return null;

  return (
    <section className="section genres-section">
      <h2 className="section-title">Browse Genres</h2>
      <div className="genres-grid">
        {genres.map((genre, index) => (
          <Card
            key={genre.tag}
            item={genre}
            type="genre"
            isLarge={index === 0} // Первая карточка увеличена
          />
        ))}
      </div>
    </section>
  );
}

export default GenreSection;