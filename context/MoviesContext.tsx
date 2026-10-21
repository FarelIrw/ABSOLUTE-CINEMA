import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { movies } from "../data/movies";
import { applyDetails, fetchMovieDetails, MovieDetails } from "../functions/tmdb";
import { Movie } from "../types/movie";

type MoviesContextValue = {
  allMovies: Movie[]; // data manual + TMDB
  details: Record<number, MovieDetails>; // data TMDB per film (kunci = id film)
};

const MoviesContext = createContext<MoviesContextValue>({ allMovies: movies, details: {} });

// Dulu logika ini ada di App.tsx. Sekarang tiap layar adalah file sendiri (expo-router),
// jadi data dibagikan lewat Context supaya semua layar bisa memakainya
// dan TMDB cukup dipanggil SEKALI di sini.
export function MoviesProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<Record<number, MovieDetails>>({});

  useEffect(() => {
    let ignore = false;

    for (const movie of movies) {
      fetchMovieDetails(movie.title, movie.year).then((data) => {
        if (!ignore && data) {
          setDetails((prev) => ({ ...prev, [movie.id]: data }));
        }
      });
    }

    return () => {
      ignore = true;
    };
  }, []);

  const allMovies = useMemo(
    () => movies.map((movie) => applyDetails(movie, details[movie.id])),
    [details]
  );

  return (
    <MoviesContext.Provider value={{ allMovies, details }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  return useContext(MoviesContext);
}
