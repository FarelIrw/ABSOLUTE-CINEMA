import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { formatDuration } from "../functions/movieUtils";
import { fetchPosterUrl } from "../functions/tmdb";
import { homeStyles } from "../styles/homeStyles";
import { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  // State: URL poster. null = belum ada (sedang dimuat / tidak ditemukan / token kosong)
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // Effect: jalan setelah kartu tampil, dan lagi hanya jika judul/tahun berubah
  useEffect(() => {
    let ignore = false;

    fetchPosterUrl(movie.title, movie.year).then((url) => {
      if (!ignore) {
        setPosterUrl(url); // ubah state -> kartu dirender ulang
      }
    });

    // Cleanup: abaikan hasil jika kartu sudah hilang sebelum data datang
    return () => {
      ignore = true;
    };
  }, [movie.title, movie.year]);

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