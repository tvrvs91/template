import React from 'react';
import Card from './Card';

// Компонент отображает секцию с популярными треками
// Принимает массив треков
function HotSection({ tracks }) {
  if (!tracks || tracks.length === 0) return null; // Ничего не отображаем, если треков нет

  return (
    <section className="section hot-section">
      <h2 className="section-title">Hot Right Now</h2>
      <div className="hot-grid">
        {tracks.map((track, index) => (
          <Card 
            key={`${track.title}-${index}`} // Уникальный ключ для каждой карточки трека
            item={track}
            type="track"
          />
        ))}
      </div>
    </section>
  );
}

export default HotSection;
