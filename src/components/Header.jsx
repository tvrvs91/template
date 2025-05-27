import React from 'react';

// Компонент заголовка с логотипом и формой поиска
// Принимает функцию onSearch для обработки поискового запроса
function Header({ onSearch }) {
  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    const query = e.target.search.value.trim(); // Получаем введённый запрос
    onSearch(query); // Передаём запрос вверх
    e.target.reset(); // Очищаем поле ввода
  };

  return (
    <header className="header">
      <div className="header-logo">Archhhiv</div>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for artists, albums, or tracks"
          name="search"
          aria-label="Search"
          required // Обязательное поле
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </header>
  );
}

export default Header;
