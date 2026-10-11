import { Image, Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie; // sudah digabung dengan data TMDB di App.tsx
  posterUrl?: string | null;
};

export default function MovieCard({ movie, posterUrl }: MovieCardProps) {
  return (
    <View style={homeStyles.card}>
      {/* Poster dari TMDB; kalau belum ada, tampilkan kotak berisi judul */}
      {posterUrl ? (
        <Image source={{ uri: posterUrl }} style={homeStyles.poster} />
      ) : (
        <View style={homeStyles.posterPlaceholder}>
          <Text style={homeStyles.posterPlaceholderText} numberOfLines={3}>
            {movie.title}
          </Text>
        </View>
      )}

      <Text style={homeStyles.cardTitle}>{movie.title}</Text>

      {/* genre • tahun • durasi (135 -> "2j 15m") */}
      <Text style={homeStyles.cardInfo}>
        {movie.genre.join(", ")} • {movie.year} • {formatDuration(movie.duration)}
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: movie.rating > 8 ? "#22c55e" : "#facc15",
        }}
      >
        ⭐ {movie.rating}
      </Text>

      {/* Sinopsis dipotong maksimal 3 baris */}
      <Text style={homeStyles.cardSynopsis} numberOfLines={3}>
        {movie.synopsis}
      </Text>
    </View>
  );
}