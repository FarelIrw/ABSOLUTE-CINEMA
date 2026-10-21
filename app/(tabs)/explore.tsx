import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import MovieCard from "../../components/MovieCard";
import SearchBar, { SearchEmpty } from "../../components/SearchBar";
import { useMovies } from "../../context/MoviesContext";
import {
  getAverageRating,
  getMoviesByGenre,
  searchMovies,
} from "../../functions/movieUtils";
import { exploreStyles } from "../../styles/exploreStyles";
import { Genre } from "../../types/movie";

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

// Tab Jelajah (route "/explore")
export default function Explore() {
  const router = useRouter();
  const { allMovies, details } = useMovies();
  const [query, setQuery] = useState("");

  // Genre disimpan di PARAMETER URL (/explore?genre=Drama), bukan di state.
  // Jadi layar lain (mis. layar detail) bisa membuka Jelajah dengan filter tertentu.
  const { genre } = useLocalSearchParams<{ genre?: string }>();
  const selected: Filter = filters.includes(genre as Filter) ? (genre as Filter) : "Semua";

  const genreMovies =
    selected === "Semua" ? allMovies : getMoviesByGenre(allMovies, selected as Genre);
  const visibleMovies = searchMovies(genreMovies, query);

  return (
    <View style={exploreStyles.container}>
      <View style={exploreStyles.header}>
        <Text style={exploreStyles.title}>Absolute Cinema</Text>
        <Text style={{ color: "#a0a0b0", marginTop: 4 }}>
          {visibleMovies.length} film • rata-rata rating{" "}
          {visibleMovies.length > 0 ? getAverageRating(visibleMovies).toFixed(1) : "-"}
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

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
              // setParams() mengubah parameter layar ini tanpa pindah halaman
              onPress={() => router.setParams({ genre: item })}
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
          <MovieCard
            movie={item}
            posterUrl={details[item.id]?.posterUrl}
            onPress={() => router.push(`/movie/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          query.trim() !== "" ? (
            <SearchEmpty query={query} />
          ) : (
            <Text style={{ color: "#a0a0b0", textAlign: "center", marginTop: 32 }}>
              Film tidak ditemukan
            </Text>
          )
        }
      />
    </View>
  );
}
