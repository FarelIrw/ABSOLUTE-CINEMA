import { Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <View style={homeStyles.card}>
      <Text style={homeStyles.cardTitle}>{movie.title}</Text>

      {/* genre • tahun • durasi (135 -> "2j 15m") */}
      <Text style={homeStyles.cardInfo}>
        {movie.genre} • {movie.year} • {formatDuration(movie.duration)}
      </Text>

      {/* Inline style: hijau jika rating di atas 8, kuning jika di bawahnya */}
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