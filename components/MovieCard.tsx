import { Image, Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { exploreStyles } from "../styles/exploreStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie; 
  posterUrl?: string | null;
};

export default function MovieCard({ movie, posterUrl }: MovieCardProps) {
  return (
    <View style={exploreStyles.card}>
      <View style={exploreStyles.posterWrapper}>
        
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} style={exploreStyles.poster} />
        ) : (
          <View style={exploreStyles.posterPlaceholder}>
            <Text style={exploreStyles.posterPlaceholderText} numberOfLines={4}>
              {movie.title}
            </Text>
          </View>
        )}

        <View style={exploreStyles.ratingBadge}>
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

      <View style={exploreStyles.cardBody}>
        <Text style={exploreStyles.cardTitle} numberOfLines={2}>
          {movie.title}
        </Text>

        <Text style={exploreStyles.cardInfo}>
          {movie.genre.join(", ")} • {movie.year} • {" "}
          {formatDuration(movie.duration)}
        </Text>

        <Text style={exploreStyles.cardSynopsis} numberOfLines={5}>
          {movie.synopsis}
        </Text>
      </View>
      
    </View>
  );
}