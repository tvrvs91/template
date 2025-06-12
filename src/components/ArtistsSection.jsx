import React from 'react';
import Card from './Card'; // Компонент для отображения отдельной карточки артиста
import LoadingSpinner from './LoadingSpinner'; // Компонент загрузки

// Компонент отображает секцию "Top Artists"
// Принимает список артистов и флаг загрузки
function ArtistsSection({ artists, loading }) {
  return (
    <section className="section artists-section">
      <h2 className="section-title">Top Artists</h2>
      <div className="artists-grid">
        {loading ? (
          // Показываем спиннер, если идет загрузка
          <LoadingSpinner message="Waiting for a GOATs..." />
        ) : artists.length === 0 ? (
          // Если список пуст — выводим сообщение об ошибке и кнопку перезагрузки
          <div className="error">
            <p>Failed to load top artists</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : (
          // Иначе отображаем список карточек артистов
          artists.map((artist) => (
            <Card
              key={artist.title} // Используем title как ключ
              item={artist}
              type="artist"
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ArtistsSection;
