const API_KEY = '66b2b5f87d9d396a46ce3769e05d0778';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const genresGrid = document.getElementById('genresGrid');
const latestReleases = document.getElementById('latestReleases');
const hotRightNow = document.getElementById('hotRightNow');
const topArtists = document.getElementById('topArtists');
const topTracks = document.getElementById('topTracks');

// Popular genres with placeholder data
const popularGenres = [
  { name: 'Rock', tag: 'rock' },
  { name: 'Pop', tag: 'pop' },
  { name: 'Hip-Hop', tag: 'hip-hop' },
  { name: 'Electronic', tag: 'electronic' },
  { name: 'Jazz', tag: 'jazz' },
  { name: 'Metal', tag: 'metal' },
  { name: 'R&B', tag: 'r-n-b' },
  { name: 'Indie', tag: 'indie' }
];

/**
 * Fetch data from Last.fm API with retry
 */
async function fetchLastFM(method, params = {}, retries = 3) {
  const url = new URL(BASE_URL);
  url.searchParams.set('method', method);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchLastFM(method, params, retries - 1);
    }
    console.error('Error fetching data:', error);
    showError('Failed to load data. Please try again later.');
    return null;
  }
}

/**
 * Get top album for artist
 */
async function getTopAlbum(artistName) {
  const data = await fetchLastFM('artist.gettopalbums', { 
    artist: artistName,
    limit: 1
  });
  
  if (data?.topalbums?.album?.length > 0) {
    return data.topalbums.album[0].image[2]?.['#text'] || null;
  }
  return null;
}

/**
 * Get top artist for genre
 */
async function getTopArtistForGenre(genre) {
  const data = await fetchLastFM('tag.gettopartists', {
    tag: genre,
    limit: 1
  });
  
  if (data?.topartists?.artist?.length > 0) {
    return {
      name: data.topartists.artist[0].name,
      image: await getTopAlbum(data.topartists.artist[0].name)
    };
  }
  return null;
}

/**
 * Display error message
 */
function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error';
  errorElement.textContent = message;
  document.body.appendChild(errorElement);
  setTimeout(() => errorElement.remove(), 3000);
}


async function createCard(item, type) {
  const card = document.createElement('div');
  card.className = `card ${type}-card`; // Добавляем класс по типу
  
  let imageUrl, title, subtitle, url;
  
  if (type === 'artist') {
    imageUrl = await getTopAlbum(item.name) || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    title = item.name;
    subtitle = 'Artist';
    url = `https://www.last.fm/music/${encodeURIComponent(item.name)}`;
  } else if (type === 'track') {
    imageUrl = await getTopAlbum(item.artist.name) || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    title = item.name;
    subtitle = item.artist.name;
    url = `https://www.last.fm/music/${encodeURIComponent(item.artist.name)}/_/${encodeURIComponent(item.name)}`;
  } else if (type === 'album') {
    imageUrl = item.image[2]?.['#text'] || await getTopAlbum(item.artist.name) || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    title = item.name;
    subtitle = item.artist.name;
    url = `https://www.last.fm/music/${encodeURIComponent(item.artist.name)}/${encodeURIComponent(item.name)}`;
  } else if (type === 'genre') {
    const genreData = await getTopArtistForGenre(item.tag);
    imageUrl = genreData?.image || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    title = item.name;
    subtitle = 'Genre';
    url = `https://www.last.fm/tag/${encodeURIComponent(item.tag)}`;
  }
  
  card.innerHTML = `
    <a href="${url}" target="_blank">
      <img src="${imageUrl}" alt="${title}" class="card-image">
      <div class="card-info">
        <div class="card-title">${title}</div>
        <div class="card-subtitle">${subtitle}</div>
      </div>
    </a>
  `;
  
  return card;
}
/**
 * Load genres with top artists
 */
async function loadGenres() {
  genresGrid.innerHTML = '<div class="loading">Loading genres...</div>';
  
  const genreCards = await Promise.all(
    popularGenres.map(genre => createCard(genre, 'genre'))
  );
  
  genresGrid.innerHTML = '';
  genreCards.forEach(card => {
    genresGrid.appendChild(card);
  });
}

/**
 * Load latest releases (используем тег new-releases)
 */
async function loadLatestReleases() {
  latestReleases.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Discovering new music...</p>
    </div>
  `;
  
  try {
    // Пробуем получить новые релизы через тег
    const data = await fetchLastFM('tag.gettopalbums', { 
      tag: 'new',
      limit: 8
    });
    
    if (!data?.albums?.album || data.albums.album.length === 0) {
      // Если не получилось, пробуем альтернативный тег
      const alternativeData = await fetchLastFM('tag.gettopalbums', {
        tag: 'alternative',
        limit: 8
      });
      
      if (!alternativeData?.albums?.album) {
        latestReleases.innerHTML = '<div class="info">Check back later for new releases</div>';
        return;
      }
      
      // Используем альтернативные данные
      const albumCards = await Promise.all(
        alternativeData.albums.album.map(album => createCard(album, 'album'))
      );
      
      latestReleases.innerHTML = '';
      albumCards.forEach(card => {
        latestReleases.appendChild(card);
      });
      return;
    }
    
    // Используем основные данные
    const albumCards = await Promise.all(
      data.albums.album.map(album => createCard(album, 'album'))
    );
    
    latestReleases.innerHTML = '';
    albumCards.forEach(card => {
      latestReleases.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error loading releases:', error);
    latestReleases.innerHTML = `
      <div class="error">
        <p>Currently unable to show new releases</p>
        <button onclick="loadLatestReleases()">Try again</button>
      </div>
    `;
  }
}

/**
 * Load hot right now (top tracks)
 */
async function loadHotRightNow() {
  hotRightNow.innerHTML = '<div class="loading">Loading hot tracks...</div>';
  
  const data = await fetchLastFM('chart.gettoptracks', { limit: 8 });
  if (!data?.tracks?.track) return;
  
  const trackCards = await Promise.all(
    data.tracks.track.map(track => createCard(track, 'track'))
  );
  
  hotRightNow.innerHTML = '';
  trackCards.forEach(card => {
    hotRightNow.appendChild(card);
  });
}

/**
 * Load top artists
 */
async function loadTopArtists() {
  topArtists.innerHTML = '<div class="loading">Loading top artists...</div>';
  
  const data = await fetchLastFM('chart.gettopartists', { limit: 12 });
  if (!data?.artists?.artist) return;
  
  const artistCards = await Promise.all(
    data.artists.artist.map(artist => createCard(artist, 'artist'))
  );
  
  topArtists.innerHTML = '';
  artistCards.forEach(card => {
    topArtists.appendChild(card);
  });
}

/**
 * Load top tracks
 */
async function loadTopTracks() {
  topTracks.innerHTML = '<div class="loading">Loading top tracks...</div>';
  
  const data = await fetchLastFM('chart.gettoptracks', { limit: 12 });
  if (!data?.tracks?.track) return;
  
  const trackCards = await Promise.all(
    data.tracks.track.map(track => createCard(track, 'track'))
  );
  
  topTracks.innerHTML = '';
  trackCards.forEach(card => {
    topTracks.appendChild(card);
  });
}

/**
 * Handle search - redirect to Last.fm
 */
function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  
  if (query) {
    window.open(`https://www.last.fm/search?q=${encodeURIComponent(query)}`, '_blank');
    searchInput.value = '';
  }
}

// Initialize with improved loading sequence
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load visible content first
    await Promise.all([
      loadGenres(),
      loadLatestReleases(),
      loadHotRightNow()
    ]);
    
    // Then load secondary content
    await Promise.all([
      loadTopArtists(),
      loadTopTracks()
    ]);
    
    // Setup search
    searchForm.addEventListener('submit', handleSearch);
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to initialize application. Please refresh the page.');
  }
});