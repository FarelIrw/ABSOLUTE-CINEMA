import { Genre, Movie } from  "../types/movie"


export function getMoviesByGenre(
  movies: Movie[],
  genre: Genre
): Movie[] {
  const result: Movie[] = [];

  for (const movie of movies) {
    if (movie.genre.includes(genre)) {
      result.push(movie);
    }
  }

  return result;
}


export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}j ${remainingMinutes}m`;
}



export function getAverageRating(movies: Movie[]): number {
  if (movies.length === 0) {
    return 0;
  }

  let totalRating = 0;

  for (let i = 0; i < movies.length; i++) {
    totalRating += movies[i].rating;
  }

  return totalRating / movies.length;
}

// Mencari film berdasarkan judul, genre, tahun, atau sinopsis.
// Semua kata yang diketik harus cocok; judul diprioritaskan di urutan teratas.
export function searchMovies(movies: Movie[], query: string): Movie[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return movies; // kotak kosong: tampilkan semua
  }

  const found: { movie: Movie; score: number }[] = [];

  for (const movie of movies) {
    const title = movie.title.toLowerCase();
    const other = `${movie.genre.join(" ")} ${movie.year} ${movie.synopsis}`.toLowerCase();

    let score = 0;
    let allMatch = true;

    for (const word of words) {
      if (title.startsWith(word)) {
        score += 3;
      } else if (title.includes(word)) {
        score += 2;
      } else if (other.includes(word)) {
        score += 1;
      } else {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      found.push({ movie, score });
    }
  }

  // Skor tertinggi dulu, kalau sama urutkan berdasarkan rating
  found.sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating);

  return found.map((item) => item.movie);
}