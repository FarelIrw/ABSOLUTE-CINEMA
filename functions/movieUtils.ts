import { Genre, Movie } from  "../types/movie"

// 1. Mengambil film berdasarkan genre
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


// 2. Mengubah durasi menit menjadi jam dan menit
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}j ${remainingMinutes}m`;
}


// 3. Menghitung mean rating film
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
