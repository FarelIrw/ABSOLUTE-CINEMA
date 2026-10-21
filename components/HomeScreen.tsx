import { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { MovieDetails } from "../functions/tmdb";
import { exploreStyles } from "../styles/exploreStyles";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";
import MovieRow from "./MovieRow";

type HomeScreenProps = {
  movies: Movie[]; // data gabungan manual + TMDB (allMovies dari App)
  details: Record<number, MovieDetails>;
  onSeeAll: () => void; // pindah ke tab Jelajah
  onMoviePress: (movie: Movie) => void; // buka layar detail film
};

// Layar Beranda: film unggulan + baris "Rating Tertinggi" dan "Film Terbaru".
// Hanya membaca data dari App, tidak memanggil TMDB sendiri.
export default function HomeScreen({ movies, details, onSeeAll, onMoviePress }: HomeScreenProps) {
  // Urutan rating tertinggi -> terendah (salinan, array asli tidak diubah)
  const topRated = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating),
    [movies]
  );

  // Urutan tahun rilis terbaru -> terlama
  const newest = useMemo(
    () => [...movies].sort((a, b) => b.year - a.year),
    [movies]
  );

  const featured = topRated[0];
  const featuredPoster = featured ? details[featured.id]?.posterUrl : null;

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>Absolute Cinema</Text>
        <Text style={{ color: "#a0a0b0", marginTop: 4 }}>
          Tonton film favoritmu
        </Text>
      </View>

      <ScrollView contentContainerStyle={homeStyles.content}>
        {featured && (
          <Pressable style={homeStyles.hero} onPress={() => onMoviePress(featured)}>
            {featuredPoster ? (
              <Image
                source={{ uri: featuredPoster }}
                style={homeStyles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <View style={homeStyles.heroPlaceholder}>
                <Text style={homeStyles.heroPlaceholderText}>
                  {featured.title}
                </Text>
              </View>
            )}

            <View style={homeStyles.heroInfo}>
              <Text style={homeStyles.heroTag}>⭐ {featured.rating} • UNGGULAN</Text>
              <Text style={homeStyles.heroTitle} numberOfLines={2}>
                {featured.title}
              </Text>
              <Text style={homeStyles.heroMeta}>
                {featured.genre.join(", ")} • {featured.year} •{" "}
                {formatDuration(featured.duration)}
              </Text>
            </View>
          </Pressable>
        )}

        <MovieRow
          title="Rating Tertinggi"
          movies={topRated.slice(0, 6)}
          details={details}
          onSeeAll={onSeeAll}
          onMoviePress={onMoviePress}
        />
        <MovieRow
          title="Film Terbaru"
          movies={newest.slice(0, 6)}
          details={details}
          onSeeAll={onSeeAll}
          onMoviePress={onMoviePress}
        />
      </ScrollView>
    </View>
  );
}