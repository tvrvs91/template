import React from 'react';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

function ReleasesSection({ releases, loading }) {
  return (
    <section className="section releases-section">
      <h2 className="section-title">The Latest Releases</h2>
      <div className="releases-grid">
        {loading ? (
          <LoadingSpinner message="Discovering new music..." />
        ) : releases.length === 0 ? (
          <div className="info">Check back later for new releases</div>
        ) : (
          releases.map((release) => (
            <Card
              key={`${release.title}-${release.subtitle}`}
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