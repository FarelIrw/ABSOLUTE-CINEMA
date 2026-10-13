import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import BottomNav, { ComingSoon, TabKey, tabs } from "./components/BottomNav";
import HomeScreen from "./components/HomeScreen";
import MovieCard from "./components/MovieCard";
import SearchBar, { SearchEmpty } from "./components/SearchBar";
import { movies } from "./data/movies";
import {
  getAverageRating,
  getMoviesByGenre,
  searchMovies,
} from "./functions/movieUtils";
import { applyDetails, fetchMovieDetails, MovieDetails } from "./functions/tmdb";
import { exploreStyles } from "./styles/exploreStyles";
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

  // State: teks yang diketik di kotak pencarian
  const [query, setQuery] = useState("");

  // State: tab navbar yang sedang aktif
  const [tab, setTab] = useState<TabKey>("home");

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

  // Langkah 1: saring berdasarkan genre yang dipilih
  const genreMovies =
    selected === "Semua" ? allMovies : getMoviesByGenre(allMovies, selected);

  // Langkah 2: saring lagi berdasarkan teks pencarian (kosong = tampilkan semua)
  const visibleMovies = searchMovies(genreMovies, query);

  const activeTab = tabs.find((t) => t.key === tab)!;

  return (
    <View style={exploreStyles.container}>
      {tab === "home" ? (
        <HomeScreen
          movies={allMovies}
          details={details}
          onSeeAll={() => setTab("explore")}
        />
      ) : tab !== "explore" ? (
        <ComingSoon title={activeTab.label} icon={activeTab.icon} />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={exploreStyles.header}>
            <Text style={exploreStyles.title}>Absolute Cinema</Text>
            <Text style={{ color: "#a0a0b0", marginTop: 4 }}>
              {visibleMovies.length} film • rata-rata rating{" "}
              {visibleMovies.length > 0
                ? getAverageRating(visibleMovies).toFixed(1)
                : "-"}
            </Text>
          </View>

          {/* Kotak pencarian: di bawah header, di atas filter genre */}
          <SearchBar value={query} onChangeText={setQuery} />

          {/* Filter genre (inline style: chip aktif berbeda warna) */}
          <View style={{ paddingVertical: 12 }}>
            <FlatList
              horizontal
              data={filters}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
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
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <MovieCard movie={item} posterUrl={details[item.id]?.posterUrl} />
            )}
            ListEmptyComponent={
              query.trim() !== "" ? (
                <SearchEmpty query={query} />
              ) : (
                <Text
                  style={{ color: "#a0a0b0", textAlign: "center", marginTop: 32 }}
                >
                  Film tidak ditemukan
                </Text>
              )
            }
          />
        </View>
      )}

      <BottomNav active={tab} onChange={setTab} />
    </View>
  );
}