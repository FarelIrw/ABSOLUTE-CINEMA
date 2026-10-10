// Mengambil URL poster film dari TMDB (tanpa menyimpan gambar di project)

const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

type SearchResult = {
  poster_path: string | null;
};

type SearchResponse = {
  results: SearchResult[];
};

// Hasil pencarian disimpan di sini supaya film yang sama tidak diminta dua kali
const cache: Record<string, string | null> = {};

export async function fetchPosterUrl(
  title: string,
  year: number
): Promise<string | null> {
  if (!TOKEN) {
    return null;
  }

  const key = `${title}-${year}`;
  if (key in cache) {
    return cache[key];
  }

  const url =
    "https://api.themoviedb.org/3/search/movie" +
    `?query=${encodeURIComponent(title)}&year=${year}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!response.ok) {
      return null;
    }

    const data: SearchResponse = await response.json();
    const path = data.results.length > 0 ? data.results[0].poster_path : null;
    const posterUrl = path ? `${IMAGE_BASE}${path}` : null;

    cache[key] = posterUrl;
    return posterUrl;
  } catch {
    return null;
  }
}