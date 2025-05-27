const API_KEY = '97b88d20dca0f2b4c6494edde4adc00c';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// Жанры для отображения на главной
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

//вызов API Last.fm
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
    throw error;
  }
}


// Получение изображения топ-альбома артиста (поскольку функция с фото артиста отображает звёздочку, вот такой обход)
async function getTopAlbum(artistName) {
  try {
    const data = await fetchLastFM('artist.gettopalbums', {
      artist: artistName,
      limit: 1
    });
    
    if (data?.topalbums?.album?.[0]?.image?.[2]?.['#text']) {
      return data.topalbums.album[0].image[2]['#text'];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching top album for ${artistName}:`, error);
    return null;
  }
}

// Получение топ-артиста по жанру с изображением
async function getTopArtistForGenre(genre) {
  const data = await fetchLastFM('tag.gettopartists', {
    tag: genre,
    limit: 1
  });
  
  if (data?.topartists?.artist?.length > 0) {
    const image = await getTopAlbum(data.topartists.artist[0].name);
    return {
      name: data.topartists.artist[0].name,
      imageUrl: image || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
      subtitle: 'Artist', 
      url: `https://www.last.fm/music/${encodeURIComponent(data.topartists.artist[0].name)}`
    };
  }
  return null;
}

// Получение списка жанров с данными по топ-артистам
export async function fetchGenres() {
  const genrePromises = popularGenres.map(async (genre, index) => {
    const genreData = await getTopArtistForGenre(genre.tag);
    return {
      ...genre,
      imageUrl: genreData?.imageUrl || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
      subtitle: genre.name, // Изменили здесь - теперь будет название жанра
      url: `https://www.last.fm/tag/${encodeURIComponent(genre.tag)}`,
      isLarge: index === 0
    };
  });
  
  return Promise.all(genrePromises);
}

// Получение последних релизов
export async function fetchLatestReleases() {
  try {
    const data = await fetchLastFM('tag.gettopalbums', { 
      tag: 'new',
      limit: 8
    });
    
    // fallback на альтернативный тег, если данных нет
    if (!data?.albums?.album || data.albums.album.length === 0) {
      const alternativeData = await fetchLastFM('tag.gettopalbums', {
        tag: 'alternative',
        limit: 8
      });
      
      if (!alternativeData?.albums?.album) {
        return [];
      }
      
      return alternativeData.albums.album.map(album => ({
        imageUrl: album.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
        title: album.name,
        subtitle: album.artist.name,
        url: `https://www.last.fm/music/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`,
        type: 'album'
      }));
    }
    
    return data.albums.album.map(album => ({
      imageUrl: album.image[2]?.['#text'] || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
      title: album.name,
      subtitle: album.artist.name,
      url: `https://www.last.fm/music/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`,
      type: 'album'
    }));
    
  } catch (error) {
    console.error('Error loading releases:', error);
    throw error;
  }
}

// Получение самых популярных треков сейчас
export async function fetchHotRightNow() {
  const data = await fetchLastFM('chart.gettoptracks', { limit: 16 });
  if (!data?.tracks?.track) return [];
  
  const tracksWithImages = await Promise.all(
    data.tracks.track.map(async track => {
      const imageUrl = await getTopAlbum(track.artist.name) || 
        'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
      
      return {
        imageUrl,
        title: track.name,
        subtitle: track.artist.name,
        url: `https://www.last.fm/music/${encodeURIComponent(track.artist.name)}/_/${encodeURIComponent(track.name)}`,
        type: 'track'
      };
    })
  );
  
  return tracksWithImages;
}

// Получение топ артистов
export async function fetchTopArtists() {
  const data = await fetchLastFM('chart.gettopartists', { limit: 12 });
  if (!data?.artists?.artist) return [];
  
  const artistPromises = data.artists.artist.map(async artist => {
    const imageUrl = await getTopAlbum(artist.name) || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    return {
      imageUrl,
      title: artist.name,
      subtitle: 'Artist',
      url: `https://www.last.fm/music/${encodeURIComponent(artist.name)}`,
      type: 'artist'
    };
  });
  
  return Promise.all(artistPromises);
}

// Получение топ треков
export async function fetchTopTracks() {
  const data = await fetchLastFM('chart.gettoptracks', { limit: 12 });
  if (!data?.tracks?.track) return [];
  
  const tracksWithImages = await Promise.all(
    data.tracks.track.map(async track => {
      const imageUrl = await getTopAlbum(track.artist.name) || 
        'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
      
      return {
        imageUrl,
        title: track.name,
        subtitle: track.artist.name,
        url: `https://www.last.fm/music/${encodeURIComponent(track.artist.name)}/_/${encodeURIComponent(track.name)}`,
        type: 'track'
      };
    })
  );
  
  return tracksWithImages;
}