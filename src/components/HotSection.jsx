import React from 'react';
import Card from './Card';

function HotSection({ tracks }) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="section hot-section">
      <h2 className="section-title">Hot Right Now</h2>
      <div className="hot-grid">
        {tracks.map((track, index) => (
          <Card 
            key={`${track.title}-${index}`}
            item={track}
            type="track"
          />
        ))}
      </div>
    </section>
  );
}

export default HotSection;