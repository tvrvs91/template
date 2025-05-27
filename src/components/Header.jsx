import React from 'react';

function Header({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    onSearch(query);
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
          required
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </header>
  );
}

export default Header;