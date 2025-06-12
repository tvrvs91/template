import React from 'react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

// Компонент секции последних релизов
// Принимает список релизов и состояние загрузки
function ReleasesSection({ releases, loading }) {
  return (
    <section className="section releases-section">
      <h2 className="section-title">The Latest Releases</h2>
      <div className="releases-grid">
        {loading ? (
          <LoadingSpinner message="Discovering new music..." /> // Показать спиннер при загрузке
        ) : releases.length === 0 ? (
          <div className="info">Check back later for new releases</div> // Сообщение, если нет данных
        ) : (
          releases.map((release) => (
            <Card
              key={`${release.title}-${release.subtitle}`} // Уникальный ключ
              item={release}
              type="album"
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ReleasesSection;
