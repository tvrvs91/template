import React from 'react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

function TracksSection({ tracks, loading }) {
  return (
    <section className="section tracks-section">
      <h2 className="section-title">Top Tracks</h2>
      <div className="tracks-grid">
        {loading ? (
          <LoadingSpinner message="Loading top tracks..." />
        ) : tracks.length === 0 ? (
          <div className="error">
            <p>Failed to load top tracks</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : (
          tracks.map((track) => (
            <Card
              key={`${track.title}-${track.subtitle}`}
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