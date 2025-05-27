import React from 'react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

function ArtistsSection({ artists, loading }) {
  return (
    <section className="section artists-section">
      <h2 className="section-title">Top Artists</h2>
      <div className="artists-grid">
        {loading ? (
          <LoadingSpinner message="Waiting for a GOATs..." />
        ) : artists.length === 0 ? (
          <div className="error">
            <p>Failed to load top artists</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : (
          artists.map((artist) => (
            <Card
              key={artist.title}
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