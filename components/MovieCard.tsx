import { Text, View } from "react-native";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <View style={homeStyles.card}>
      <Text style={homeStyles.cardTitle}>{movie.title}</Text>
      <Text style={homeStyles.cardInfo}>
        {movie.genre} • {movie.year}
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
    </View>
  );
}