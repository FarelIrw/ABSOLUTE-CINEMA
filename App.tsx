import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import MovieCard from "./components/MovieCard";
import { movies } from "./data/movies";
import { getAverageRating, getMoviesByGenre } from "./functions/movieUtils";
import { applyDetails, fetchMovieDetails, MovieDetails } from "./functions/tmdb";
import { homeStyles } from "./styles/homeStyles";
import { Genre } from "./types/movie";

type Filter = Genre | "Semua";

const filters: Filter[] = [
  "Semua",
  "Action",
  "Animation",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Thriller",
];

export default function App() {
  const [selected, setSelected] = useState<Filter>("Semua");

  // State: data TMDB per film (kunci = id film). Awalnya kosong.
  const [details, setDetails] = useState<Record<number, MovieDetails>>({});

  // Effect: jalan sekali setelah render pertama ([]), memanggil TMDB untuk semua film
  useEffect(() => {
    let ignore = false;

    for (const movie of movies) {
      fetchMovieDetails(movie.title, movie.year).then((data) => {
        if (!ignore && data) {
          // ubah state -> layar dirender ulang dengan data terbaru
          setDetails((prev) => ({ ...prev, [movie.id]: data }));
        }
      });
    }

    // Cleanup: abaikan hasil yang datang setelah App tidak aktif lagi
    return () => {
      ignore = true;
    };
  }, []);

  // Gabungkan data manual dengan data TMDB; dihitung ulang hanya jika details berubah
  const allMovies = useMemo(
    () => movies.map((movie) => applyDetails(movie, details[movie.id])),
    [details]
  );

  // Filter dan rata-rata rating memakai data gabungan (genre & rating dari TMDB)
  const visibleMovies =
    selected === "Semua" ? allMovies : getMoviesByGenre(allMovies, selected);

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>Absolute Cinema</Text>
        <Text style={{ color: "#a0a0b0", marginTop: 4 }}>
          {visibleMovies.length} film • rata-rata rating{" "}
          {visibleMovies.length > 0
            ? getAverageRating(visibleMovies).toFixed(1)
            : "-"}
        </Text>
      </View>

      {/* Filter genre (inline style: chip aktif berbeda warna) */}
      <View style={{ paddingVertical: 12 }}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelected(item)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 20,
                marginRight: 8,
                backgroundColor: item === selected ? "#ffffff" : "#1a1a24",
              }}
            >
              <Text
                style={{
                  color: item === selected ? "#0f0f14" : "#ffffff",
                  fontWeight: "600",
                }}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={visibleMovies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard movie={item} posterUrl={details[item.id]?.posterUrl} />
        )}
        ListEmptyComponent={
          <Text style={{ color: "#a0a0b0", textAlign: "center", marginTop: 32 }}>
            Film tidak ditemukan
          </Text>
        }
      />
    </View>
  );
}