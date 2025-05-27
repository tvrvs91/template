const API_KEY = '3539efbccedbf8c6dffc8d1659aa2309';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const genresGrid = document.getElementById('genresGrid');
const latestReleases = document.getElementById('latestReleases');
const hotRightNow = document.getElementById('hotRightNow');
const topArtists = document.getElementById('topArtists');
const topTracks = document.getElementById('topTracks');

const popularGenres = [
  { name: 'Rock', tag: 'rock' },
  { name: 'Pop', tag: 'pop' },
  { name: 'Hip-Hop', tag: 'hip-hop' },
  { name: 'Electronic', tag: 'electronic' },
  { name: 'Jazz', tag: 'jazz' },
  { name: 'Metal', tag: 'metal' },
  { name: 'Punk', tag: 'punk' },
  { name: 'Indie', tag: 'indie' }
];

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

function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error';
  errorElement.textContent = message;
  document.body.appendChild(errorElement);
  setTimeout(() => errorElement.remove(), 3000);
}

async function createCard(item, type, isLarge = false) {
  const card = document.createElement('div');
  card.className = `card ${type}-card${isLarge ? ' large' : ''}`; // Добавляем класс `large`, если isLarge = true

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

async function loadGenres() {
  genresGrid.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading genres...</p>
    </div>
  `;

  const genreCards = await Promise.all(
    popularGenres.map((genre, index) => createCard(genre, 'genre', index === 0)) 
  );

  genresGrid.innerHTML = '';
  genreCards.forEach(card => {
    genresGrid.appendChild(card);
  });
}


async function loadLatestReleases() {
  latestReleases.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Discovering new music...</p>
    </div>
  `;
  
  try {
    const data = await fetchLastFM('tag.gettopalbums', { 
      tag: 'new',
      limit: 8
    });
    
    if (!data?.albums?.album || data.albums.album.length === 0) {
      const alternativeData = await fetchLastFM('tag.gettopalbums', {
        tag: 'alternative',
        limit: 8
      });
      
      if (!alternativeData?.albums?.album) {
        latestReleases.innerHTML = '<div class="info">Check back later for new releases</div>';
        return;
      }
      
      const albumCards = await Promise.all(
        alternativeData.albums.album.map(album => createCard(album, 'album'))
      );
      
      latestReleases.innerHTML = '';
      albumCards.forEach(card => {
        latestReleases.appendChild(card);
      });
      return;
    }
    
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

async function loadHotRightNow() {
  hotRightNow.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading hot sheee...</p>
    </div>
  `;
  
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

async function loadTopArtists() {
  topArtists.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Waiting for a GOATs...</p>
    </div>
  `;
  
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

async function loadTopTracks() {
  topTracks.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading top tracks...</p>
    </div>
  `;
  
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

function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  
  if (query) {
    window.open(`https://www.last.fm/search?q=${encodeURIComponent(query)}`, '_blank');
    searchInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([
      loadGenres(),
      loadLatestReleases(),
      loadHotRightNow()
    ]);

    await Promise.all([
      loadTopArtists(),
      loadTopTracks()
    ]);
    
    searchForm.addEventListener('submit', handleSearch);
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to initialize application. Please refresh the page.');
  }
});