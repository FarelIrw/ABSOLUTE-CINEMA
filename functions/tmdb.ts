import { Genre, Movie } from "../types/movie";

const TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;
const API = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const GENRE_BY_ID: Record<number, Genre> = {
  28: "Action",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  878: "Sci-Fi",
  53: "Thriller",
};

export type MovieDetails = {
  posterUrl: string | null;
  genres: Genre[] | null; // hanya genre yang ada di tipe Genre
  rating: number | null; // skala 0-10, 1 angka desimal
  synopsis: string | null; // bahasa Indonesia
  duration: number | null; // menit
};

type SearchResponse = {
  results: { id: number; poster_path: string | null; release_date?: string }[];
};

type DetailResponse = {
  vote_average: number;
  overview: string;
  runtime: number | null;
  genres: { id: number }[];
};

const cache: Record<string, Promise<MovieDetails | null>> = {};
let warnedNoToken = false;

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`TMDB ${response.status}`);
  }
  return (await response.json()) as T;
}

// Mengembalikan data film, atau null jika film memang tidak ditemukan.
// Melempar error jika request gagal (supaya tidak ikut tersimpan di cache).
async function load(title: string, year: number): Promise<MovieDetails | null> {
  // Request 1: cari film untuk mendapatkan id dan poster
  const search = await getJson<SearchResponse>(
    `${API}/search/movie?query=${encodeURIComponent(title)}&year=${year}`
  );

  // Utamakan hasil yang tahun rilisnya cocok, kalau tidak ada pakai hasil pertama
  const match =
    search.results.find((r) => r.release_date?.startsWith(String(year))) ??
    search.results[0];
  if (!match) {
    return null;
  }

  // Request 2: ambil detail dalam bahasa Indonesia (sinopsis, durasi, rating)
  const detail = await getJson<DetailResponse>(
    `${API}/movie/${match.id}?language=id-ID`
  );

  const genres: Genre[] = [];
  for (const g of detail.genres ?? []) {
    const mapped = GENRE_BY_ID[g.id];
    if (mapped && !genres.includes(mapped)) {
      genres.push(mapped);
    }
  }

  return {
    posterUrl: match.poster_path ? `${IMAGE_BASE}${match.poster_path}` : null,
    genres: genres.length > 0 ? genres : null,
    // vote_average 0 berarti belum ada penilaian -> anggap tidak ada
    rating:
      detail.vote_average > 0 ? Math.round(detail.vote_average * 10) / 10 : null,
    // overview kosong berarti belum ada terjemahan Indonesia
    synopsis: detail.overview.trim() !== "" ? detail.overview : null,
    duration: detail.runtime ? detail.runtime : null,
  };
}

export function fetchMovieDetails(
  title: string,
  year: number
): Promise<MovieDetails | null> {
  if (!TOKEN) {
    if (!warnedNoToken) {
      console.warn("[TMDB] EXPO_PUBLIC_TMDB_TOKEN kosong, pakai data manual.");
      warnedNoToken = true;
    }
    return Promise.resolve(null);
  }

  const key = `${title}-${year}`;
  if (!(key in cache)) {
    cache[key] = load(title, year).catch((error) => {
      console.warn(`[TMDB] gagal memuat "${title}":`, error.message);
      delete cache[key]; // jangan simpan kegagalan, biar bisa dicoba lagi
      return null;
    });
  }
  return cache[key];
}

// Menimpa data manual dengan data TMDB. Field yang tidak ada di TMDB tetap memakai data manual.
export function applyDetails(
  movie: Movie,
  details: MovieDetails | undefined
): Movie {
  if (!details) {
    return movie;
  }
  return {
    ...movie,
    genre: details.genres ?? movie.genre,
    rating: details.rating ?? movie.rating,
    duration: details.duration ?? movie.duration,
    synopsis: details.synopsis ?? movie.synopsis,
  };
}