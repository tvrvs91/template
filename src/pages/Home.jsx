import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import GenreSection from '../components/GenreSection';
import ReleasesSection from '../components/ReleasesSection';
import HotSection from '../components/HotSection';
import ArtistsSection from '../components/ArtistsSection';
import TracksSection from '../components/TracksSection';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchGenres,
  fetchLatestReleases,
  fetchHotRightNow,
  fetchTopArtists,
  fetchTopTracks
} from '../services/lastfm';

function Home() {
  const [data, setData] = useState({
    genres: [],
    releases: [],
    hotTracks: [],
    topArtists: [],
    topTracks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [genres, releases, hotTracks, topArtists, topTracks] = await Promise.all([
          fetchGenres(),
          fetchLatestReleases(),
          fetchHotRightNow(),
          fetchTopArtists(),
          fetchTopTracks()
        ]);

        setData({
          genres,
          releases,
          hotTracks,
          topArtists,
          topTracks
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (query) => {
    if (query) {
      window.open(`https://www.last.fm/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header onSearch={handleSearch} />
        <LoadingSpinner message="Loading music data..." />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header onSearch={handleSearch} />
      <main className="main-content">
        <GenreSection genres={data.genres} />
        <ReleasesSection releases={data.releases} />
        <HotSection tracks={data.hotTracks} />
        <ArtistsSection artists={data.topArtists} />
        <TracksSection tracks={data.topTracks} />
      </main>
    </div>
  );
}

export default Home;