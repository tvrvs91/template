import React from 'react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

// Компонент секции популярных треков
// Принимает массив треков и флаг загрузки
function TracksSection({ tracks, loading }) {
  return (
    <section className="section tracks-section">
      <h2 className="section-title">Top Tracks</h2>
      <div className="tracks-grid">
        {loading ? (
          <LoadingSpinner message="Loading top tracks..." /> // Спиннер во время загрузки
        ) : tracks.length === 0 ? (
          <div className="error">
            <p>Failed to load top tracks</p> {/* Сообщение об ошибке */}
            <button onClick={() => window.location.reload()}>Try again</button> {/* Перезагрузка страницы */}
          </div>
        ) : (
          tracks.map((track) => (
            <Card
              key={`${track.title}-${track.subtitle}`} // Уникальный ключ для каждой карточки
              item={track}
              type="track"
            />
          ))
        )}
      </div>
    </section>
  );
}

export default TracksSection;
