import { Image, Pressable, Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { exploreStyles } from "../styles/exploreStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie; 
  posterUrl?: string | null;
  onPress?: () => void; // dipanggil saat kartu ditekan
};

export default function MovieCard({ movie, posterUrl, onPress }: MovieCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [exploreStyles.card, pressed && { opacity: 0.7 }]}
    >
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
      
    </Pressable>
  );
}