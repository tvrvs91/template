import React from 'react';
import { useNavigate } from 'react-router-dom';

// Компонент заголовка с логотипом и формой поиска
// Принимает функцию onSearch для обработки поискового запроса
function Header() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    e.target.reset();
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
