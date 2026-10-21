import { FlatList, Image, Pressable, Text, View } from "react-native";
import { MovieDetails } from "../functions/tmdb";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";

type MovieRowProps = {
  title: string;
  movies: Movie[];
  details: Record<number, MovieDetails>; // data TMDB per film (untuk poster)
  onSeeAll?: () => void;
  onMoviePress?: (movie: Movie) => void; // dipanggil saat poster ditekan
};

// Satu baris film yang bisa digeser ke samping, dengan judul section di atasnya
export default function MovieRow({ title, movies, details, onSeeAll, onMoviePress }: MovieRowProps) {
  return (
    <View style={homeStyles.section}>
      <View style={homeStyles.sectionHeader}>
        <Text style={homeStyles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll}>
            <Text style={homeStyles.seeAll}>Lihat semua</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.rowContent}
        renderItem={({ item }) => {
          const posterUrl = details[item.id]?.posterUrl;
          return (
            <Pressable style={homeStyles.rowCard} onPress={() => onMoviePress?.(item)}>
              {posterUrl ? (
                <Image source={{ uri: posterUrl }} style={homeStyles.rowPoster} />
              ) : (
                <View style={homeStyles.rowPlaceholder}>
                  <Text style={homeStyles.rowPlaceholderText} numberOfLines={4}>
                    {item.title}
                  </Text>
                </View>
              )}

              <View style={homeStyles.rowBadge}>
                <Text
                  style={[
                    homeStyles.rowBadgeText,
                    { color: item.rating > 8 ? "#22c55e" : "#facc15" },
                  ]}
                >
                  ⭐ {item.rating}
                </Text>
              </View>

              <Text style={homeStyles.rowTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={homeStyles.rowYear}>{item.year}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}