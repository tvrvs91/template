import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchSearchResults } from '../services/lastfm';

function SearchPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    const loadResults = async () => {
      setLoading(true);
      try {
        const data = await fetchSearchResults(query);
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
        setResults({ error: true });
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query, navigate]);

  if (loading) {
    return <LoadingSpinner message={`Searching for "${query}"...`} />;
  }

  if (results?.error) {
    return (
      <div className="error">
        <p>Failed to load results</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  return (
    <div className="search-page container">
      <h1 className="search-title">Results for: "{query}"</h1>
      
      {results?.artists?.length > 0 && (
        <section className="search-section">
          <h2 className="search-subtitle">Artists</h2>
          <div className="search-grid">
            {results.artists.map(artist => (
              <Card key={artist.url} item={artist} type="artist" />
            ))}
          </div>
        </section>
      )}

      {results?.tracks?.length > 0 && (
        <section className="search-section">
          <h2 className="search-subtitle">Tracks</h2>
          <div className="search-grid">
            {results.tracks.map(track => (
              <Card key={track.url} item={track} type="track" />
            ))}
          </div>
        </section>
      )}

      {results?.albums?.length > 0 && (
        <section className="search-section">
          <h2 className="search-subtitle">Albums</h2>
          <div className="search-grid">
            {results.albums.map(album => (
              <Card key={album.url} item={album} type="album" />
            ))}
          </div>
        </section>
      )}

      {results?.isEmpty && (
        <div className="search-empty">No results found for "{query}"</div>
      )}
    </div>
  );
}

export default SearchPage;