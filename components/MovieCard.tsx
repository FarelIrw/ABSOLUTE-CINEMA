import { Image, Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie; 
  posterUrl?: string | null;
};

export default function MovieCard({ movie, posterUrl }: MovieCardProps) {
  return (
    <View style={homeStyles.card}>
      <View style={homeStyles.posterWrapper}>
        
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={homeStyles.poster} />
        ) : (
          <View style={homeStyles.posterPlaceholder}>
            <Text style={homeStyles.posterPlaceholderText} numberOfLines={4}>
              {movie.title}
            </Text>
          </View>
        )}

        <View style={homeStyles.ratingBadge}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: movie.rating > 8 ? "#22c55e" : "#facc15",
            }}
          >
            ⭐ {movie.rating}
          </Text>
        </View>
      </View>

      <View style={homeStyles.cardBody}>
        <Text style={homeStyles.cardTitle} numberOfLines={2}>
          {movie.title}
        </Text>

        <Text style={homeStyles.cardInfo}>
          {movie.genre.join(", ")} • {movie.year} • {" "}
          {formatDuration(movie.duration)}
        </Text>

        <Text style={homeStyles.cardSynopsis} numberOfLines={5}>
          {movie.synopsis}
        </Text>
      </View>
      
    </View>
  );
}