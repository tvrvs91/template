import React from 'react';

// Компонент отображает карточку элемента (артиста, трека и т.д.)
// Принимает: объект item, тип карточки (type), флаг isLarge
function Card({ item, type, isLarge = false }) {
  if (!item) return null; // Ничего не рендерим, если данных нет

  // Функция для обрезки длинных строк
  const truncate = (str, n) => {
    return str.length > n ? str.substring(0, n) + '...' : str;
  };

  return (
    <div className={`card ${type}-card${isLarge ? ' large' : ''}`}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="card-link">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="card-image"
          onError={(e) => {
            // Показываем изображение-заглушку, если оригинальное не загрузилось
            e.target.src = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
          }}
        />
        <div className="card-info">
          <h3 className="card-title" title={item.title}>
            {item.title}
          </h3>
          <p className="card-subtitle" title={item.subtitle}>
            {item.subtitle}
          </p>
        </div>
      </a>
    </div>
  );
}

export default Card;
